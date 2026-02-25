import axios from 'axios'
import { checkArray, checkNumber, checkString, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from './apiMessagesBase.js'
import { moduleInstances, moduleTypes, type moduleInstancesType, type moduleTypesType } from './module-utils.js'
import { Router, type Request, type Response } from 'express'
import { sendApiMessageSimple, type apiMessageSimple } from './apiMessageSimple.js'
import { isNumber, isString } from './utils.js'

const apiTarget : string = "127.0.0.1:8089"

type module = {
        module_type : moduleTypesType
        uid : string
        instance : moduleInstancesType
    }
type modulesResult = {
    modules : module[]
}

async function sendModules() : Promise<modulesResult>{
    let opts : apiMessageOptions = {
        url: "/system/modules"
    }

    let response = await sendJsonApiMessage(opts);
    
    checkArray({data:response.jsonValue},"data",(element : any)=>{
        checkStringEnum(element,"module_type",moduleTypes,opts);
        checkString(element,"uid",opts);
        checkStringEnum(element,"instance",moduleInstances,opts);
        return true;
    },opts);

    return {
        modules: response.jsonValue
    }
}


const moduleToEndpoints: { [k in moduleTypesType]: apiMessageSimple[] } = {
    "control": [
        { url: "/control/led_panel/temperature", key: "temperature" },
        { url: "/control/heater/plate_temperature", key: "temperature" },
    ],
    "core": [],
    "pump": [],
    "sensor": [
        { url: "/sensor/bottle/temperature", key: "temperature" },
        { url: "/sensor/bottle/top/measured_temperature", key: "temperature" },
        { url: "/sensor/bottle/bottom/measured_temperature", key: "temperature" },
        { url: "/sensor/fluorometer/detector/temperature", key: "temperature" },
        { url: "/sensor/fluorometer/emitor/temperature", key: "temperature" },
        { url: "/sensor/spectrophotometer/emitor/temperature", key: "temperature" },
        { url: "/sensor/bottle/temperature", key: "temperature" },
    ],
    "undefined": []
}





type Log = {
    data : Record<string,number>,
}

class LogContainer{
    logs : Record<string,(number|undefined)[]> = {}
    len : number;
    head : number = 0;
    newestLogTime : number = 0;
    step : number = 0;

    constructor(length : number, stepSize : number){
        this.len = length
        this.step = stepSize;
    }

    push(log : Log, currTime : number){

        for(let endpoint in log.data){
            let logData = log.data[endpoint];
            if(logData){
                if(this.logs[endpoint] === undefined){
                    this.logs[endpoint] = [];
                    this.logs[endpoint].length = this.len;
                }
    
                this.logs[endpoint][this.head] = logData;
            }
        }

        this.head = (this.head+1) % this.len;
        this.newestLogTime = currTime;
    }

    getValues(timeBack : number) : Record<string,(number|undefined)[]>{
        let result : Record<string,(number|undefined)[]> = {};

        if(this.newestLogTime == timeBack){
            return result
        }

        let resultLen : number = timeBack / this.step
        if(resultLen > this.len){
            resultLen = this.len;
        }

        for(let endpoint in this.logs){
            let resultPart : (number | undefined)[] = [];
            let history = this.logs[endpoint]
            if(history){
                for (let i = this.len-1 ; i >= this.len-resultLen; i--){
                    let index = Math.trunc((i + this.head) % this.len)
                    resultPart.push(history[index])
                }
            }
            result[endpoint]= resultPart;
        }

        return result;
    }

    avg(timeBack : number) : Log{
        let counts : Record<string, number> = {}
        let sums : Record<string, number> = {}

        let logsSection = this.getValues(timeBack);

        for(let endpoint in logsSection){
            counts[endpoint] = 0;
            sums[endpoint] = 0;
            if(logsSection[endpoint]){
                for(let log of logsSection[endpoint]){
                    if(log !== undefined){
                        counts[endpoint]+=1;
                        sums[endpoint]+=log;
                    }
                }
            }
        }

        let log : Log = {data: {}}

        for (const endpoint in counts) {
            const sum = sums[endpoint] ?? 0;
            const count = counts[endpoint] ?? 0;
            if(count > 0){
                log.data[endpoint] = sum / count;
            }
        }

        return log;
    }
}

type ParsedLog = {endpoint: string, values:(number|undefined)[]}
function logsToApiResponse(logs : Record<string,(number|undefined)[]>,historyLen:number) : {logs:ParsedLog[],logCount:number, historyLen:number}{
    let result  : ParsedLog[] = [];
    let logCount = 0;
    for(let endpoint in logs){
        logCount = 0;
        if(logs[endpoint]){
            result.push({
                endpoint: endpoint,
                values: logs[endpoint]
            })  
            logCount=logs[endpoint].length;
        }
    }

    return {
        logs: result,
        logCount: logCount,
        historyLen: historyLen
    };
}

export class TempLogger {
    router: Router = Router();

    loadedModules : module[] = [];
    forceReload : boolean = true;
    lastReload : number = 0;

    updateCounter : number = 0;

    timeStarted : number;

    mLogs : LogContainer
    hLogs : LogContainer
    dLogs : LogContainer

    lastHUpdate : number = Date.now();
    lastDUpdate : number = Date.now();

    constructor(historyLen : number) {
        this.mLogs = new LogContainer(historyLen,    1000);
        this.hLogs = new LogContainer(historyLen,   60000);
        this.dLogs = new LogContainer(historyLen, 3600000);

        this.timeStarted = Date.now();

        this.router.post("/",(req: Request, res: Response)=>{
            this.getter(req,res);
        })

        console.debug("temperature logger initiated");

        setInterval(()=>{
            this.update()
        },1000)
    }

    async reloadModules() : Promise<boolean>{
        try {
            this.lastReload = Date.now();
            let result = await sendModules();
            this.forceReload = false;
            
            this.loadedModules = result.modules;
            return true;
        } catch (error) {
            this.loadedModules = [];
            console.error(error);
            return false;
        }
    }

    async update(){
        if(this.forceReload || Date.now()-this.lastReload > 10000){
            if(!(await this.reloadModules())){
                return
            }
        }

        let currentLog : Log = {
            data: {}
        }

        let currTime = Date.now();

        let lastHUpdate = this.lastHUpdate;
        let updateHLog = false;
        if(currTime-lastHUpdate > 60000){
            this.lastHUpdate = currTime;
            updateHLog = true;
        }

        let updateDLog = false;
        let lastDUpdate = this.lastDUpdate;
        if(currTime-lastDUpdate > 3600000){
            this.lastDUpdate = currTime;
            updateDLog = true;
        }

        //creates an array of promises. every promise is an api call getting the target endpoints value
        let apiMessages : Promise<any>[] = []
        for(let module of this.loadedModules){
            for(let target of moduleToEndpoints[module.module_type]){
                apiMessages.push((async ()=>{
                    let log = "";
                    try {
                        log = "getting api message: "+target.url
                        let result = await sendApiMessageSimple(target);
                        
                        if(!isNumber(result)){
                            console.debug(log," returned wrong type: ", typeof result);
                            return;
                        }
    
                        currentLog.data[target.url] = result;
                    } catch (error) {
                        console.error("Error while getting: ",log,"\n", error);
                        this.forceReload = true;
                    }
                })())
            }
        }

        await Promise.allSettled(apiMessages);

        this.mLogs.push(currentLog,currTime);
        if(updateHLog){
            console.debug("temperature logger hour log updated");
            this.hLogs.push(
                this.mLogs.avg(currTime - lastHUpdate),currTime
            );
        }
        if(updateDLog){
            console.debug("temperature logger day log updated");
            this.dLogs.push(
                this.dLogs.avg(currTime - lastDUpdate),currTime
            );
        }
    }

    getter(req: Request, res: Response){
        let timeBack = req.body["timeBack"];
        let maxTimeBack = Date.now()-this.timeStarted;
        if(timeBack > maxTimeBack){
            timeBack = maxTimeBack;
        }
        if(isNumber(timeBack)){
            let scope = req.body["scope"];
            if(isString(req.body["scope"])){
                let result : Record<string,(number|undefined)[]> = {};
                let historyLen : number = 0;
                switch (scope) {
                    case "M":
                        result = this.mLogs.getValues(timeBack);
                        historyLen=this.mLogs.len;
                        break;
                    case "H":
                        result = this.hLogs.getValues(timeBack);
                        historyLen=this.hLogs.len;
                        break;
                    case "D":
                        result = this.dLogs.getValues(timeBack);
                        historyLen=this.dLogs.len;
                        break;
                
                    default:
                        res.status(400).send(JSON.stringify({message:"invalid scope selected"}))
                        return;
                }
                res.status(200).send(JSON.stringify(logsToApiResponse(result,historyLen)));
                return
            }
        }
        res.status(400).send(JSON.stringify({message:"missing values in message body"}));    
    }
}