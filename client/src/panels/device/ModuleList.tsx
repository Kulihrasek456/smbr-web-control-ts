import { createSignal } from "solid-js";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import type { moduleInstancesType } from "../../common/other/ModuleListProvider";
import { TableStatic } from "../../common/Table/Table";
import { Widget } from "../common/Widget";
import { Button } from "../../common/Button/Button";
import { Icon } from "../../common/Icon/Icon";
import { ApiFetcher } from "../../common/ApiFetcher/ApiFetcher";
import { apiMessageSimple } from "../../apiMessages/apiMessage";


type row = {
    name: string,
    id: string,
    instance: moduleInstancesType
}

function renderRow(value : row, index: number){
    return([
        <p>{value.name}</p>,
        <p>{value.id}</p>,
        <p>{value.instance}</p>,
        <ApiFetcher target={new apiMessageSimple(value.name+"/ping","time_ms")} unit="ms"></ApiFetcher>,
        <ApiFetcher target={new apiMessageSimple(value.name+"/core_temp","temperature")} unit="°C"></ApiFetcher>,
        <ApiFetcher target={new apiMessageSimple(value.name+"/board_temp","temperature")} unit="°C"></ApiFetcher>,
        <ApiFetcher target={new apiMessageSimple(value.name+"/load","load")} unit="%"></ApiFetcher>,
        <Button>
            <Icon name="refresh"></Icon>
        </Button>
    ])
}

interface ModuleListDisplayProps{
    id : string
}

export function ModuleListDisplay(props : ModuleListDisplayProps){
    const [rows, setRows] = createSignal<row[]>([
        {
            name: "core",
            id: "0x0123456789ab",
            instance: "Exclusive"
        },
        {
            name: "control",
            id: "0xfedcba987654",
            instance: "Instance_12"
        },
        {
            name: "sensor",
            id: "0xfedcba987655",
            instance: "Exclusive"
        }
    ]);

    return (
        <GridElement id={props.id} h={2} w={2}>
            <Widget name="Module list">
                <TableStatic
                    headers={["name","id","instance","ping","core temperature","module temperature","CPU load","reset"]}
                    data={rows()}
                    colSizes={["90px","150px","130px",undefined,undefined,undefined,undefined,"35px"]}
                    renderRow={renderRow}
                    fillHeight={true}
                ></TableStatic>
            </Widget>
        </GridElement>
    )
}