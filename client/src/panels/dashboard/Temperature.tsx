import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { TableStatic } from "../../common/Table/Table"
import { Widget, WidgetHotbarValue } from "../common/Widget"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import type { JSX } from "solid-js/jsx-runtime"
import { Button } from "../../common/Button/Button"
import { createEffect, createSignal, type JSXElement } from "solid-js"
import { Icon } from "../../common/Icon/Icon"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"
import { getColor } from "../../common/other/colorGenerator"
import { LineChart } from "../../common/LineChart/LineChart"
import { getCountdownArray } from "../../common/other/utils"
import { countInstancesOfType, getInstancesForType, moduleInstanceColors, useModuleListValue, type Module, type moduleInstancesType } from "../../common/other/ModuleListProvider"

type row = {
    icon: string, 
    name: string, 
    target: apiMessageSimple | undefined, 
    instance: moduleInstancesType
    subRowIndex?: number,
}

function createRow(data: row, index:number) : JSXElement[] {
    return [
        <Icon color={getColor(index)} name={data.icon}></Icon>,
            <p style={{
                "justify-content":"start"
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

    function refreshRows(moduleList: Module[]) {
        if (moduleListCntxt) {
            let result: row[] = [];

            if (countInstancesOfType(moduleList, "sensor", "Exclusive") > 0) {
                result.push(
                    {
                        icon:       "water_full", 
                        name:       "Bottle", 
                        target:     new apiMessageSimple("/sensor/bottle/temperature","temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "┣", 
                        name:       "Top", 
                        target:     new apiMessageSimple("/sensor/bottle/top/measured_temperature","temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "┗", 
                        name:       "Bottom", 
                        target:     new apiMessageSimple("/sensor/bottle/bottom/measured_temperature","temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "water_lux", 
                        name:       "Fluorometer", 
                        target:     undefined,
                        instance:   "Exclusive"
                    },{
                        icon:       "┣", 
                        name:       "Detector", 
                        target:     new apiMessageSimple("/sensor/fluorometer/detector/temperature","temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "┗", 
                        name:       "Emitor", 
                        target:     new apiMessageSimple("/sensor/fluorometer/emitor/temperature","temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "wb_incandescent", 
                        name:       "Spectrophotometer", 
                        target:     new apiMessageSimple("/sensor/spectrophotometer/emitor/temperature", "temperature"),
                        instance:   "Exclusive"
                    },{
                        icon:       "wb_twilight", 
                        name:       "LED panel", 
                        target:     new apiMessageSimple("/control/led_panel/temperature", "temperature"),
                        instance:   "Exclusive"
                    },
                )
            }

            if(countInstancesOfType(moduleList, "control","Exclusive")>0){
                result.push(
                    {
                        icon:       "mode_heat", 
                        name:       "Heater plate", 
                        target:     new apiMessageSimple("/control/heater/plate_temperature", "temperature"),
                        instance:   "Exclusive"
                    }
                )
            }

            for (let instance of getInstancesForType(moduleList, "pump")) {
                result.push({
                    icon: "water_full",
                    name: "test",
                    target: new apiMessageSimple("/sensor/bottle/temperature", "temperature"),
                    instance: instance
                })
            }

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
                                    target: new apiMessageSimple("", ""),
                                    interval: 3000,
                                    unit: " ms",
                                }}></WidgetHotbarValue>
                            <Button callback={async () => { return true }} ><p>test</p></Button>
                        </>
                    )
                }}
            >
                <TableStatic renderRow={createRow} data={rows()} headers={["color", "name", "current"]} colSizes={["40px","100%","60px"]}></TableStatic>
                <div style={{flex:"1 1 auto", "min-height": 0}}>
                    <LineChart labels={getCountdownArray(15)} datasets={[{data:getCountdownArray(15),label:"test"}]}></LineChart>
                </div>
            </Widget>
        </GridElement>
    )
}