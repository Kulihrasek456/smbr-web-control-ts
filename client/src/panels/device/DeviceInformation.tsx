import { apiMessageSimple } from "../../apiMessages/apiMessage"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Widget } from "../common/Widget"
import { TableStatic } from "../../common/Table/Table"
import { createSignal } from "solid-js"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"

interface DeviceInformationProps{
    id:string
}

type row = {
    label:string,
    value: apiMessageSimple,
    unit? : string
}

function renderRow(value : row, index : number){
    return ([
        <p style={{"justify-content":"left"}}>{value.label}</p>,
        <ApiFetcher target={value.value} unit={value.unit}></ApiFetcher>
    ])
}

export function DeviceInformation(props:DeviceInformationProps){
    const [rows,setRows] = createSignal<row[]>([
        {
            label: "SID",
            value: new apiMessageSimple("/core/sid", "sid")
        },{
            label: "IP address",
            value: new apiMessageSimple("/core/ip_address", "ipAddress")
        },{
            label: "Hostname",
            value: new apiMessageSimple("/core/hostname", "hostname")
        },{
            label: "Serial number",
            value: new apiMessageSimple("/core/serial", "serial")
        },{
            label: "Supply voltage",
            value: new apiMessageSimple("/core/supply/5v", "voltage"),
            unit: "V"
        },{
            label: "Supply vin",
            value: new apiMessageSimple("/core/supply/vin", "voltage"),
            unit: "V"
        },{
            label: "Supply poe",
            value: new apiMessageSimple("/core/supply/poe", "voltage"),
            unit: "V"
        },{
            label: "Supply current",
            value: new apiMessageSimple("/core/supply/current", "current"),
            unit: "A"
        },{
            label: "Supply power_draw",
            value: new apiMessageSimple("/core/supply/power_draw", "power_draw"),
            unit: "W"
        }
    ])

    return (
        <GridElement id={props.id} w={1} h={Math.round(rows().length/2.5)}>
            <Widget name="Device information">
                <TableStatic
                    data={rows()}
                    headers={["field","value"]}
                    colSizes={[undefined,"100px"]}
                    renderRow={renderRow}
                    fillHeight={true}
                ></TableStatic>
            </Widget>
        </GridElement>
    )
}