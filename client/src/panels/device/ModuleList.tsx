import { createEffect, createSignal } from "solid-js";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { useModuleListValue, type moduleInstancesType, type moduleTypesType } from "../../common/other/ModuleListProvider";
import { TableStatic } from "../../common/Table/Table";
import { Widget } from "../common/Widget";
import { Button } from "../../common/Button/Button";
import { Icon } from "../../common/Icon/Icon";
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher";
import { sendApiMessageSimplePost } from "../../apiMessages/apiMessageSimple";
import { refreshValueUpdate, useRefreshValue } from "../../common/other/RefreshProvider";
import { System } from "../../apiMessages/system/_";


async function restartModule(moduleType: moduleTypesType, uid: string){
    await sendApiMessageSimplePost({url:"/"+moduleType+"/restart",key:"uid"},uid);
    return true
}

function renderRow(value : System.module, index: number){
    return([
        <p>{value.module_type}</p>,
        <p>{value.uid}</p>,
        <p>{value.instance}</p>,
        <ApiFetcher 
            numberOnly={{decimalPlaces: 2}} 
            target={{url: "/"+value.module_type+"/ping" ,key: "time_ms"}} 
            unit="ms"
        ></ApiFetcher>,
        <ApiFetcher 
            numberOnly={{decimalPlaces: 2}} 
            target={{url: "/"+value.module_type+"/core_temp" ,key: "temperature"}} 
            unit="°C"
        ></ApiFetcher>,
        <ApiFetcher 
            numberOnly={{decimalPlaces: 2}} 
            target={{url: "/"+value.module_type+"/board_temp" ,key: "temperature"}} 
            unit="°C"
        ></ApiFetcher>,
        <ApiFetcher 
            numberOnly={{
                decimalPlaces: 2,
                resultModifier: (value:number)=>(value*100)
            }} 
            target={{url: "/"+value.module_type+"/load" ,key: "load"}} 
            unit="%"
        ></ApiFetcher>,
        <Button callback={()=>restartModule(value.module_type,value.uid)}>
            <Icon name="refresh"></Icon>
        </Button>
    ])
}

interface ModuleListDisplayProps{
    id : string
}

interface ModuleListDisplayBodyProps extends ModuleListDisplayProps{
    rowNumSetter : (value:number)=>void
}

export function ModuleListDisplayBody(props : ModuleListDisplayBodyProps){
    const [rows, setRows] = createSignal<System.module[]>([]);
    const moduleListCntxt = useModuleListValue();

    createEffect(()=>{
        if(moduleListCntxt){
            let new_rows : System.module[] = [];
            for(let module of moduleListCntxt.state()){
                new_rows.push({
                    module_type: module.type,
                    uid: module.uid,
                    instance: module.instance
                })
            }
            setRows(new_rows);
        }
    })

    createEffect(()=>{
        props.rowNumSetter(rows().length);
    })

    

    return (
        <TableStatic
            headers={["name","id","instance","ping","core temperature","module temperature","CPU load","reset"]}
            data={rows()}
            colSizes={["90px","150px","130px",undefined,undefined,undefined,undefined,"35px"]}
            renderRow={renderRow}
            fillHeight={true}
        ></TableStatic>
    )
}

export function ModuleListDisplay(props : ModuleListDisplayProps){
    const [rowNum, setRowNum] = createSignal(0);

    return (
        <GridElement id={props.id} h={1 + Math.round(rowNum()/3)} w={2}>
            <Widget name="Module list">
                <ModuleListDisplayBody rowNumSetter={setRowNum} {...props}></ModuleListDisplayBody>
            </Widget>
        </GridElement>
    )
}