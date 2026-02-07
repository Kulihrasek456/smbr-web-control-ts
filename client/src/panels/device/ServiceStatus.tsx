import { createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { TableStatic } from "../../common/Table/Table"
import { Widget } from "../common/Widget"

import styles from "./ServiceStatus.module.css"

interface ServiceStatusProps{
    id:string
}

type row= {
    state: string,
    name: string,
    stateDuration : string
}

function renderRow(value : row, index : number){
    let state = styles.warning;
    switch(value.state){
        case "active":
            state=styles.ok;
            break;
        case "failed":
        case "inactive":
            state=styles.error;
            break;
    }

    return([
        <p classList={{
            [state]:true,
            [styles.service_status]:true
        }}>{value.state}</p>,
        <p>{value.name}</p>,
        <p>{value.stateDuration}</p>
    ])
}

export function ServiceStatus(props : ServiceStatusProps){
    const [rows, setRows] = createSignal<row[]>([
        {state: "inactive",name: "reactor-database-export",stateDuration:""},
        {state: "inactive",name:"reactor-api-server",stateDuration:""},
        {state: "waiting",name:"reactor-core-module",stateDuration:""},
        {state: "active",name:"avahi-daemon",stateDuration:"41min"},
        {state: "active",name:"avahi-daemon.socket",stateDuration:"41min"}
    ])
    return(
        <GridElement id={props.id} w={1} h={Math.round(rows().length/2.5)}>
            <Widget name="Service status">
                <TableStatic
                    data={rows()}
                    headers={["state","service name","in this state for"]}
                    colSizes={["80px",undefined,"70px"]}
                    renderRow={renderRow}
                    fillHeight={true}
                ></TableStatic>
            </Widget>
        </GridElement>
    )
}