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
import { getCountdownArray } from "../../common/other/utils"
import { countInstancesOfType, getInstancesForType, moduleInstanceColors, useModuleListValue, type Module, type moduleInstancesType } from "../../common/other/ModuleListProvider"
import { RadialSelect } from "../../common/RadialSelect/RadialSelect"
import type { apiMessageSimple } from "../../apiMessages/apiMessageSimple"

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
            <ApiFetcher target={data.target} unit="°C"></ApiFetcher>
        ):(
            <p></p>
        )
    ]
}


interface TemperatureProps{
    id: string;
}

export function Temperature(props:TemperatureProps) {
    let i=0;
    const [rows, setRows] = createSignal<row[]>([]);
    const moduleListCntxt = useModuleListValue();
    const scopeGroupName = createUniqueId()

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
                        target:     { url: "/sensor/bottle/top/measured_temperature", key: "temperature" },
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


    return (
        <GridElement id={props.id} w={1} h={5 + Math.round(rows().length/3)}>
            <Widget
                name="Temperature"
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
                        {value:"m",label:"minute"},
                        {value:"s",label:"hour"},
                        {value:"d",label:"day"}
                    ]}
                ></RadialSelect>
                <div style={{flex:"1 1 auto", "min-height": 0}}>
                    <LineChart 
                        labels={getCountdownArray(15)} 
                        datasets={[{data:getCountdownArray(15),label:"test"}]}
                    ></LineChart>
                </div>
                
            </Widget>
        </GridElement>
    )
}