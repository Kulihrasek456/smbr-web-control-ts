import { TableStatic } from "../../common/Table/Table"
import { Widget, WidgetHotbarValue } from "../common/Widget"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import type { JSX } from "solid-js/jsx-runtime"
import { Button } from "../../common/Button/Button"
import { createEffect, createSignal, createUniqueId, type JSXElement } from "solid-js"
import { Icon } from "../../common/Icon/Icon"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"
import { getColor } from "../../common/other/colorGenerator"
import { LineChart } from "../../common/LineChart/LineChart"
import { formatTime, getCountdownArray } from "../../common/other/utils"
import { countInstancesOfType, getInstancesForType, moduleInstanceColors, useModuleListValue, type Module, type moduleInstancesType } from "../../common/other/ModuleListProvider"
import { RadialSelect } from "../../common/RadialSelect/RadialSelect"
import type { apiMessageSimple } from "../../apiMessages/apiMessageSimple"
import { RefreshProvider, refreshValueUpdate, useRefreshValue } from "../../common/other/RefreshProvider"
import { TemperatureLogs } from "../../apiMessages/temperature-logs/_"

// create subrows by setting icon as undefined
// row indexes are then given automatically after generating the array
type row = {
    icon?: string,
    name: string, 
    target: apiMessageSimple | undefined, 
    instance: moduleInstancesType,
    subRowIndex?: number,
    rowIndex? : number,
    lastSubRow? : boolean
}

function createRow(data: row, index:number) : JSXElement[] {
    return [
        <Icon 
            color={
                getColor(data.rowIndex || 0,data.subRowIndex || 0)
            } 
            name={
                (data.icon)?(
                    data.icon
                ):(
                    (data.lastSubRow)?(
                        "┗"
                    ):(
                        "┣"
                    )
                )
            }
        ></Icon>,

        <p style={{
            "justify-content":"start",
            "border-left": (data.instance != "Exclusive")?`3px solid ${moduleInstanceColors[data.instance]}`:undefined,
            "padding-left": (data.instance != "Exclusive")?"5px":undefined
        }}>{data.name}</p>,

        (data.target)?(
            <ApiFetcher target={data.target} unit="°C" numberOnly={{decimalPlaces: 2}}></ApiFetcher>
        ):(
            <p></p>
        )
    ]
}

function generateTimeLabels(currentTime : number, count : number, scope : "M"|"D"|"H") {
    const labels = [];
    const step : number = {
        "M":    1000,
        "H":   60000,
        "D": 3600000,
    }[scope];

    for (let i = 0; i < count; i++) {
        const timePoint = new Date(currentTime - (count - 1 - i) * step);
        
        const timeString = formatTime({
            "M":"HH:MM:SS",
            "H":"HH:MM",
            "D":"dd.mo HHh"
        }[scope],timePoint)
        
        labels.push(timeString);
    }

    return labels;
}


interface TemperatureProps{
    id: string;
}

interface TemperatureBodyProps extends TemperatureProps{
    rowNumberSetter : (value : number) => void;
}

export function TemperatureBody(props : TemperatureBodyProps) {
    let i=0;
    const [rows, setRows] = createSignal<row[]>([]);
    const [scope, setScope] = createSignal<"M"|"D"|"H">("M");
    const [labels, setLabels] = createSignal<string[]>([])
    const [datasets, setDatasets] = createSignal<TemperatureLogs.Logs>({})
    const [historyLen , setHistoryLen] = createSignal<number>(10);
    const moduleListCntxt = useModuleListValue();
    const scopeGroupName = createUniqueId()
    const refreshCntxt = useRefreshValue;
    let lastRefresh = 0;
    let lastScope = ""

    function assignIndexes(rows : row[]){
        let rowI=-1;
        let subRowI=0;
        let lastRow : undefined | row;
        for(let i=0;i<rows.length;i++){
            let row = rows[i];
            if(row.icon){
                row.subRowIndex=undefined;
                row.rowIndex=++rowI;
                
                subRowI = 0;
            }else{
                row.subRowIndex=++subRowI;
                row.rowIndex=rowI;
                row.lastSubRow = true;

                if(lastRow){
                    if(!lastRow.icon){
                        lastRow.lastSubRow = false;
                    }
                }
            }
            lastRow = row;
        }
        return rows;
    }

    function refreshRows(moduleList: Module[]) {
        if (moduleListCntxt) {
            let result: row[] = [];

            if (countInstancesOfType(moduleList, "sensor", "Exclusive") > 0) {
                result.push(
                    {
                        icon:       "water_full", 
                        name:       "Bottle", 
                        target:     { url: "/sensor/bottle/temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },{
                        icon:       undefined, 
                        name:       "Top", 
                        target:     { url: "/sensor/bottle/top/measured_temperature", key: "temperature"},
                        instance:   "Exclusive"
                    },{
                        icon:       undefined, 
                        name:       "Bottom", 
                        target:     { url: "/sensor/bottle/bottom/measured_temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },{
                        icon:       "water_lux", 
                        name:       "Fluorometer", 
                        target:     undefined,
                        instance:   "Exclusive"
                    },{
                        icon:       undefined, 
                        name:       "Detector", 
                        target:     { url: "/sensor/fluorometer/detector/temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },{
                        icon:       undefined, 
                        name:       "Emitor", 
                        target:     { url: "/sensor/fluorometer/emitor/temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },{
                        icon:       "wb_incandescent", 
                        name:       "Spectrophotometer", 
                        target:     { url: "/sensor/spectrophotometer/emitor/temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },{
                        icon:       "wb_twilight", 
                        name:       "LED panel", 
                        target:     { url: "/control/led_panel/temperature", key: "temperature" },
                        instance:   "Exclusive"
                    },
                )
            }

            if(countInstancesOfType(moduleList, "control","Exclusive")>0){
                result.push(
                    {
                        icon:       "mode_heat", 
                        name:       "Heater plate", 
                        target:     {url: "/control/heater/plate_temperature", key:"temperature"},
                        instance:   "Exclusive"
                    }
                )
            }

            for (let instance of getInstancesForType(moduleList, "pump")) {
                result.push({
                    icon: "water_full",
                    name: "test",
                    target: {url: "/sensor/bottle/temperature", key:"temperature"},
                    instance: instance
                })
            }

            result=assignIndexes(result);

            setRows(result);
        }
    }

    createEffect(()=>{
        if(moduleListCntxt){
            refreshRows(moduleListCntxt.state())
        }
    })

    if(moduleListCntxt){
        refreshRows(moduleListCntxt.state())
    }

    function parseDatasets(datasets : TemperatureLogs.Logs) : {data: (number|undefined)[], label: string}[]{
        let result : {data: (number|undefined)[], label: string}[] = [];
        for(let endpoint in datasets){
            if(datasets[endpoint]){
                result.push({
                    label: endpoint,
                    data: datasets[endpoint]
                })
            }
        }
        return result;
    }

    function getEmptyArray(size : number) : undefined[]{
        let arr : undefined[]= []
        arr.length = size;
        return arr;
    }

    function addLogsToChart(logs: TemperatureLogs.Logs){
        let newDatasets : TemperatureLogs.Logs = {}
        let oldDatasets = datasets();

        for(let endpoint in logs){
            if(logs[endpoint]){
                let history = historyLen();
                let newData = logs[endpoint];
                let oldData : (number|undefined)[] = getEmptyArray(history);
    
                if(oldDatasets[endpoint]){
                    oldData = oldDatasets[endpoint]
                }
    
                newDatasets[endpoint]=[...oldData.slice(newData.length),...newData];
            }
        }

        setDatasets(newDatasets)
    }

    createEffect(()=>{
        props.rowNumberSetter(rows().length)
    })
    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntxt()) && lastScope == scope()){
            return;
        }
        if(lastScope != scope()){
            lastRefresh = 0;
            setLabels(generateTimeLabels(Date.now(),historyLen(),scope()));
            lastScope = scope();
            setDatasets({});
        }
        let result = await TemperatureLogs.sendGetLogs({
            timeBack: Date.now()-lastRefresh,
            scope: scope()
        })
        if(result.logCount > 0){
            lastRefresh = Date.now();
            addLogsToChart(result.logs);
        }
        
        console.log(result.logs);
    })

    return (
            <Widget
                name="Temperature"
                customRefreshProvider={true}
                hotbarTargets={() => {
                    return (
                        <>
                            <WidgetHotbarValue
                                name="API value:"
                                apiFetcherProps={{
                                    target: {url: "",key:""},
                                    interval: 3000,
                                    unit: " ms",
                                }}></WidgetHotbarValue>
                            <Button callback={async () => { return true }} ><p>test</p></Button>
                        </>
                    )
                }}
            >
                <TableStatic 
                    renderRow={createRow} 
                    data={rows()} 
                    headers={["color", "name", "current"]} 
                    colSizes={["40px",undefined,"60px"]}
                ></TableStatic>
                <RadialSelect
                    groupName={scopeGroupName}
                    selections={[
                        {value:"M",label:"minute"},
                        {value:"H",label:"hour"},
                        {value:"D",label:"day"}
                    ]}
                    getter={scope}
                    setter={setScope}
                ></RadialSelect>
                <div style={{flex:"1 1 auto", "min-height": 0}}>
                    <LineChart 
                        labels={labels()} 
                        datasets={parseDatasets(datasets())}
                        options={{raw:{
                            scales:{
                                x:{
                                    type: 'category',
                                    ticks: {
                                        autoSkip: true,
                                    }
                                }
                            }
                        }}}
                    ></LineChart>
                </div>
                
            </Widget>
    )
}

export function Temperature(props: TemperatureProps) {
    const [rows, setRows] = createSignal(0);
    return (
        <GridElement id={props.id} w={1} h={5 + Math.round(rows() / 3)}>
            <RefreshProvider>
                <TemperatureBody 
                    rowNumberSetter={setRows}
                    {...props}
                ></TemperatureBody>
            </RefreshProvider> 
        </GridElement>
    )
}