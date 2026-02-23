import { createEffect, createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { TableStatic } from "../../common/Table/Table"
import { Widget } from "../common/Widget"

import styles from "./ServiceStatus.module.css"
import { ServicesStatus  as ServicesStatusNamespace} from "../../apiMessages/services-status/_"
import { RefreshProvider, refreshValueUpdate, useRefreshValue } from "../../common/other/RefreshProvider"

interface ServiceStatusProps{
    id:string
}
interface ServiceStatusBodyProps extends ServiceStatusProps{
    rowLenSetter : (value:number)=>void;
}

type row= {
    state: string,
    stateType : ServicesStatusNamespace.stateTypes
    name: string,
    stateDuration : string
}

function renderRow(value : row, index : number){
    let state = styles.warning;
    switch(value.stateType){
        case "ok":
            state=styles.ok;
            break;
        case "critical-problem":
            state=styles.error;
            break;
        default:
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

export function ServicesStatusBody(props : ServiceStatusBodyProps){
    const [rows, setRows] = createSignal<row[]>([])
    const refreshCntxt = useRefreshValue;

    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntxt())){
            return;
        }
        try {
            let result = await ServicesStatusNamespace.sendServicesStatus();
            let newRows : row[] = [];
            for(let service of result.services){
                newRows.push({
                    name: service.name,
                    stateDuration: service.uptime,
                    state: service.state,
                    stateType: service.stateType
                })
            }
            setRows(newRows);
        } catch (error) {
            setRows([]);
            throw error;
        }
    })

    createEffect(()=>{
        props.rowLenSetter(Math.round(rows().length/2.1))
    })


    return(
        <TableStatic
            data={rows()}
            headers={["state","service name","in this state for"]}
            colSizes={["80px",undefined,"70px"]}
            renderRow={renderRow}
            fillHeight={true}
        ></TableStatic>
    )
}

export function ServicesStatus(props : ServiceStatusProps){
    const [rowNum, setRowNum] = createSignal<number>(1);

    return (
        <GridElement id={props.id} w={1} h={rowNum()}>
            <Widget name="Service status">
                <ServicesStatusBody
                    {...props}
                    rowLenSetter={setRowNum}
                ></ServicesStatusBody>
            </Widget>
        </GridElement>
    )
}