import axios from 'axios'
import { checkArray, checkNumber, checkString, checkStringEnum, sendJsonApiMessage, type apiMessageOptions } from './apiMessagesBase.js'
import { moduleInstances, moduleTypes, type moduleInstancesType, type moduleTypesType } from './module-utils.js'
import { Router, type Request, type Response } from 'express'
import { sendApiMessageSimple, type apiMessageSimple } from './apiMessageSimple.js'
import { isNumber, isString } from './utils.js'


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
        this.head = (this.head+1) % this.len;

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

        this.newestLogTime = currTime;
    }

    getValues(fromCycle : number) : Record<string,(number|undefined)[]>{
        let result : Record<string,(number|undefined)[]> = {};

        if(this.newestLogTime == fromCycle){
            return result
        }

        let resultLen : number = Math.trunc((this.newestLogTime-fromCycle) / this.step);
        if(resultLen > this.len){
            resultLen = this.len;
        }
        
        for(let endpoint in this.logs){
            let resultPart : (number | undefined)[] = [];
            let history = this.logs[endpoint]
            if(history){
                for (let i = 1-resultLen ; i <= 0; i++){
                    resultPart.push(history[
                        (i + this.head + this.len) % this.len
                    ])
                }
            }
            result[endpoint]= resultPart;
        }

        return result;
    }

    avg(fromCycle : number) : Log{
        let counts : Record<string, number> = {}
        let sums : Record<string, number> = {}

        let logsSection = this.getValues(fromCycle);

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
function logsToApiResponse(
    logs : Record<string,(number|undefined)[]>,
    historyLen:number, 
    toCycle : number
) : {
    logs:ParsedLog[],
    logCount: number, 
    historyLen: number,
    toCycle: number
}{
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
        historyLen: historyLen,
        toCycle: toCycle
    };
}

export class TempLogger {
    router: Router = Router();

    loadedModules : module[] = [];
    forceReload : boolean = true;
    lastReload : number = 0;

    timeStarted : number;
    
    mLogs : LogContainer
    hLogs : LogContainer
    dLogs : LogContainer
    
    updateCounter : number = 0;
    lastUpdateValues : Log = {data:{}};

    constructor(historyLen : number) {
        this.mLogs = new LogContainer(historyLen,    1);
        this.hLogs = new LogContainer(historyLen,   60);
        this.dLogs = new LogContainer(historyLen, 3600);

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
        this.updateCounter++;

        this.mLogs.push(this.lastUpdateValues, this.updateCounter);

        let lastHUpdate = this.hLogs.newestLogTime;
        let lastDUpdate = this.dLogs.newestLogTime;

        if(this.updateCounter-lastHUpdate > this.hLogs.step){
            console.debug("temperature logger hour log updated");
            this.hLogs.push(
                this.mLogs.avg(lastHUpdate),this.updateCounter
            );
        }

        if(this.updateCounter-lastDUpdate > this.dLogs.step){
            console.debug("temperature logger day log updated");
            this.dLogs.push(
                this.hLogs.avg(lastDUpdate),this.updateCounter
            );
        }

        if(this.forceReload || Date.now()-this.lastReload > 10000){
            if(!(await this.reloadModules())){
                return
            }
        }

        this.lastUpdateValues = {data:{}};

        // creates a promise for every api call getting the target endpoints value
        // retrieved values are saved into the lastUpdateValues log (but only if the 
        // current update number is the same as before)
        let originalUpdateNumber = this.updateCounter;
        for(let module of this.loadedModules){
            for(let target of moduleToEndpoints[module.module_type]){
                (async ()=>{
                    try {
                        let result = await sendApiMessageSimple(target);
                        
                        if(!isNumber(result)){
                            throw Error("wrong type returned: "+ typeof result);
                        }
                        
                        if(this.updateCounter !== originalUpdateNumber){
                            console.warn(`Temperature endpoint: ${JSON.stringify(target)} took too long to answer, response was discarded (missed by : ${this.updateCounter-originalUpdateNumber} updates)`);
                        }
                        
                        this.lastUpdateValues.data[target.url] = result;

                    } catch (error) {
                        console.error("Error while getting temperature endpoint: ",JSON.stringify(target),"\n", error);
                        this.forceReload = true;
                    }
                })()
            }
        }
    }

    getter(req: Request, res: Response){
        const fromCycle : any = req.body["fromCycle"];
        const scope : any = req.body["scope"];
        if(isNumber(fromCycle) && isString(scope)){
            let targetLog : LogContainer;

            switch (scope) {
                case "M":
                    targetLog = this.mLogs;
                    break;
                case "H":
                    targetLog = this.hLogs;
                    break;
                case "D":
                    targetLog = this.dLogs;
                    break;
            
                default:
                    res.status(400).send(JSON.stringify({message:"invalid scope selected"}))
                    return;
            }

            const toCycle = targetLog.newestLogTime;
            const result = targetLog.getValues(fromCycle);
            const historyLen = targetLog.len;

            res.status(200).send(JSON.stringify(logsToApiResponse(result,historyLen,toCycle)));
            return
        }
        res.status(400).send(JSON.stringify({message:"missing values in message body"}));    
    }
}