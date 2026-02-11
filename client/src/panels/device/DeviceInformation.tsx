import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Widget } from "../common/Widget"
import { TableStatic } from "../../common/Table/Table"
import { createSignal } from "solid-js"
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher"
import type { apiMessageSimple } from "../../apiMessages/apiMessageSimple"

interface DeviceInformationProps{
    id:string
}

type row = {
    label:string,
    value: apiMessageSimple,
    unit? : string,
    numberOnly? : boolean
}

function renderRow(value : row, index : number){
    return ([
        <p style={{"justify-content":"left"}}>{value.label}</p>,
        <p style={{"justify-content":"right"}}>
            <ApiFetcher 
                numberOnly={(value.numberOnly)?{decimalPlaces:2}:undefined} 
                target={value.value} 
                unit={value.unit}
            ></ApiFetcher>
        </p>
    ])
}

export function DeviceInformation(props:DeviceInformationProps){
    const [rows,setRows] = createSignal<row[]>([
       {
            label: "SID",
            value: { url: "/core/sid", key: "sid" }
        },{
            label: "IP address",
            value: { url: "/core/ip_address", key: "ipAddress" }
        },{
            label: "Hostname",
            value: { url: "/core/hostname", key: "hostname" }
        },{
            label: "Serial number",
            value: { url: "/core/serial", key: "serial" }
        },{
            label: "Supply voltage",
            value: { url: "/core/supply/5v", key: "voltage" },
            unit: "V",
            numberOnly: true
        },{
            label: "Supply vin",
            value: { url: "/core/supply/vin", key: "voltage" },
            unit: "V",
            numberOnly: true
        },{
            label: "Supply poe",
            value: { url: "/core/supply/poe", key: "voltage" },
            unit: "V",
            numberOnly: true
        },{
            label: "Supply current",
            value: { url: "/core/supply/current", key: "current" },
            unit: "A",
            numberOnly: true
        },{
            label: "Supply power_draw",
            value: { url: "/core/supply/power_draw", key: "power_draw" },
            unit: "W",
            numberOnly: true
        }
    ])

    return (
        <GridElement id={props.id} w={1} h={Math.round(rows().length/2.5)}>
            <Widget name="Device information">
                <TableStatic
                    data={rows()}
                    headers={["field","value"]}
                    colSizes={[undefined,"150px"]}
                    renderRow={renderRow}
                    fillHeight={true}
                ></TableStatic>
            </Widget>
        </GridElement>
    )
}