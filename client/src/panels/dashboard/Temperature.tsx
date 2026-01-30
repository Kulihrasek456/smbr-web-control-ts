import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { TableStatic } from "../../common/Table/Table"
import { Widget, WidgetHotbarValue } from "../common/Widget"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import type { JSX } from "solid-js/jsx-runtime"
import { Button } from "../../common/Button/Button"
import { createSignal, type JSXElement } from "solid-js"
import { Icon } from "../../common/Icon/Icon"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"
import { getColor } from "../../common/other/colorGenerator"
import { LineChart } from "../../common/LineChart/LineChart"
import { getCountdownArray } from "../../common/other/utils"

function createRow(data: {icon: string, name: string, rowIndex: number, target: apiMessageSimple, subRowIndex?: number}, index:number) : JSXElement[] {
    return [
        <Icon color={getColor(data.rowIndex)} name={data.icon}></Icon>,
        <p style={{"justify-content":"start"}}>{data.name}</p>,
        <ApiFetcher target={data.target} unit="°C"></ApiFetcher>
    ]
}


interface TemperatureProps{
    id: string;
}

export function Temperature(props:TemperatureProps) {
    let i=0;
    let result = [
        {
            icon:       "water_full", 
            name:       "Bottle", 
            rowIndex:   i++, 
            target:     new apiMessageSimple("/sensor/bottle/temperature","temperature")
        },{
            icon:       "mode_heat", 
            name:       "Heater plate", 
            rowIndex:   i++, 
            target:     new apiMessageSimple("/control/heater/plate_temperature", "temperature")
        },{
            icon:       "wb_incandescent", 
            name:       "Spectrophotometer", 
            rowIndex:   i++, 
            target:     new apiMessageSimple("/sensor/spectrophotometer/emitor/temperature", "temperature")
        },{
            icon:       "wb_twilight", 
            name:       "LED panel", 
            rowIndex:   i++, 
            target:     new apiMessageSimple("/control/led_panel/temperature", "temperature")
        },

    ]

    for( let i=0; i < Math.random()*100; i++){
        result.push({
            icon:       "wb_twilight", 
            name:       "LED panel", 
            rowIndex:   i++, 
            target:     new apiMessageSimple("/control/led_panel/temperature", "temperature")
        })
    }


    return (
        <GridElement id={props.id} w={1} h={5 + Math.round(result.length/3)}>
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
                <TableStatic renderRow={createRow} data={result} headers={["color", "name", "current"]} colSizes={["40px","100%","60px"]}></TableStatic>
                <div style={{flex:"1 1 auto", "min-height": 0}}>
                    <LineChart labels={getCountdownArray(15)} datasets={[{data:getCountdownArray(15),label:"test"}]}></LineChart>
                </div>
            </Widget>
        </GridElement>
    )
}