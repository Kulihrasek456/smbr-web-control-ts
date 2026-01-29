import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { TableStatic } from "../../common/Table/Table"
import { Widget, WidgetHotbarValue } from "../common/Widget"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import type { JSX } from "solid-js/jsx-runtime"
import { Button } from "../../common/Button/Button"
import { createSignal } from "solid-js"
import { Icon } from "../../common/Icon/Icon"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"
import { getColor } from "../../common/other/colorGenerator"
import { LineChart } from "../../common/LineChart/LineChart"
import { getCountdownArray } from "../../common/other/utils"

function createRow(icon: string, name: string, rowIndex: number, target: apiMessageSimple, subRowIndex?: number) {
    return [
        <Icon color={getColor(rowIndex)} name={icon}></Icon>,
        <p style={{"justify-content":"start"}}>{name}</p>,
        <ApiFetcher target={target} unit="°C"></ApiFetcher>
    ]
}

interface TemperatureProps{
    id: string;
}

export function Temperature(props:TemperatureProps) {

    let i = 0
    const [tempData, setTempData] = createSignal<JSX.Element[][]>([
        createRow("water_full", "Bottle", i++, new apiMessageSimple("/sensor/bottle/temperature", "temperature")),
        createRow("mode_heat", "Heater plate", i++, new apiMessageSimple("/control/heater/plate_temperature", "temperature")),
        createRow("wb_incandescent", "Spectrophotometer", i++, new apiMessageSimple("/sensor/spectrophotometer/emitor/temperature", "temperature")),
        createRow("wb_twilight", "LED panel", i++, new apiMessageSimple("/control/led_panel/temperature", "temperature"))
    ])

    for( let i=0; i < Math.random()*100; i++){
        setTempData( tempData().concat([createRow("wb_twilight", "LED panel", i++, new apiMessageSimple("/control/led_panel/temperature", "temperature"))]) )
    }



    return (
        <GridElement id={props.id} w={1} h={5 + Math.round(tempData().length/3)}>
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
                <TableStatic data={tempData} headers={["color", "name", "current"]} colSizes={["40px","100%","60px"]}></TableStatic>
                <div style={{flex:"1 1 auto", "min-height": 0}}>
                    <LineChart labels={getCountdownArray(15)} datasets={[{data:getCountdownArray(15),label:"test"}]}></LineChart>
                </div>
            </Widget>
        </GridElement>
    )
}