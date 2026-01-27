import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { Table } from "../../common/Table"
import { Widget, WidgetHotbarValue } from "../common/Widget"
import type { JSX } from "solid-js/jsx-runtime"
import { Button } from "../../common/Button"
import { createSignal } from "solid-js"
import { Icon } from "../../common/Icon"
import { ApiFetcher } from "../../common/ApiFetcher"
import { getColor } from "../../common/colorGenerator"


function createRow(icon: string, name: string, rowIndex: number, target: apiMessageSimple, subRowIndex?: number) {
    return [
        <Icon color={getColor(rowIndex)} name={icon}></Icon>,
        <p>{name}</p>,
        <ApiFetcher target={target} unit="°C"></ApiFetcher>
    ]
}

export function Temperature() {

    let i = 0
    const [tempData, setTempData] = createSignal<JSX.Element[][]>([
        createRow("water_full", "Bottle", i++, new apiMessageSimple("/sensor/bottle/temperature", "temperature")),
        createRow("mode_heat", "Heater plate", i++, new apiMessageSimple("/control/heater/plate_temperature", "temperature")),
        createRow("wb_incandescent", "Spectrophotometer", i++, new apiMessageSimple("/sensor/spectrophotometer/emitor/temperature", "temperature")),
        createRow("wb_twilight", "LED panel", i++, new apiMessageSimple("/control/led_panel/temperature", "temperature"))
    ])



    return (
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
            <Table data={tempData} headers={() => { return ["color", "name", "current"] }}></Table>
        </Widget>
    )
}