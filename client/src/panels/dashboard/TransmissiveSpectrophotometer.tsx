import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { TableStatic } from "../../common/Table/Table";
import { Widget } from "../common/Widget";
import { Icon } from "../../common/Icon/Icon";
import { createEffect, createSignal } from "solid-js";
import { Button } from "../../common/Button/Button";
import { useRefreshValue } from "../../common/other/RefreshProvider";
import { ValueDisplay } from "../../common/ApiFetcher/ValueDisplay";
import { isDebug } from "../../common/debug/debugFlag";
import { Sensor_Spectrophotometer } from "../../apiMessages/sensor/spectrophotometer";

interface TransSpectrophotometerProps{
    id: string;
}

type row = {
    color: string,
    frequency: number,
    name: string,
    absolue_value: string,
    relative_value: string
}


function TransSpectrophotometerBody(
    props : {
        widgetProps: TransSpectrophotometerProps, 
        rowNumSetter : (value: number)=>void
    }
){
    const channelDictionary = [
        {color:"#6F00FF",frequency:430,name:"UV"},
        {color:"#007FFF",frequency:480,name:"Blue"},
        {color:"#00FF00",frequency:560,name:"Green"},
        {color:"#FF7F00",frequency:630,name:"Orange"},
        {color:"#FF0000",frequency:678,name:"Red"},
        {color:"#800000",frequency:870,name:"IR"},
    ];
    const [rows, setRows] = createSignal<row[]>([])
    const refreshValue = useRefreshValue
    
    if(isDebug){
        let newRows = []
        for(let index in channelDictionary){
            let channelDictRes = channelDictionary[index]
            newRows.push({
                color: channelDictRes.color,
                frequency: channelDictRes.frequency,
                name: channelDictRes.name,
                absolue_value: "---",
                relative_value: "---"
            })
        }
        setRows(newRows)
    }

    
    function renderRow(value : row, index: number){
        return ([
            <Icon name="circle" color={value.color}></Icon>,
            <p>{value.frequency + " nm"}</p>,
            <p style={{"justify-content":"left"}}>{value.name}</p>,
            <ValueDisplay
                value={value.absolue_value}
                numberOnly={{
                    decimalPlaces: 0
                }}
            ></ValueDisplay>,
            <ValueDisplay
                value={value.relative_value}
                unit="%"
                numberOnly={{
                    decimalPlaces: 1
                }}
            ></ValueDisplay>
        ])
    }

    createEffect(async ()=>{
        let val = refreshValue();
        if(!val || val()._ts == 0){
            return
        }
        let response = await Sensor_Spectrophotometer.sendMeasureAll();
        let newRows : row[] = []
        for(let channel of response.samples){
            let channelDictRes = channelDictionary[channel.channel]
            newRows.push({
                color: channelDictRes.color,
                frequency: channelDictRes.frequency,
                name: channelDictRes.name,
                absolue_value: channel.absolute_value.toString(),
                relative_value: channel.relative_value.toString()
            })
        }
        setRows(newRows);
    })

    createEffect(()=>{
        props.rowNumSetter(rows().length);
    })

    return (
        <>
            <TableStatic
                data={rows()}
                headers={["color","frequency","name","absolute","relative"]}
                colSizes={["35px","70px",undefined,"50px","50px"]}
                renderRow={renderRow}
                fillHeight={true}

            ></TableStatic>
            <div style={{
                flex: "0 0 auto",
                display: "flex",
                "justify-content": "end",
                "align-items": "end",
                "flex-direction": "column",
                "padding-top": 0
            }}>
                <Button >set reference</Button>
            </div>
        </>
    )
}


export function TransSpectrophotometer(props: TransSpectrophotometerProps) {
    const [rowNum, setRowNum] = createSignal(1);

    return (
        <GridElement id={props.id} w={1} h={Math.round(rowNum() / 3) + 1}>
            <Widget name="Transmissive spectrophotometer">
                <TransSpectrophotometerBody
                    widgetProps={props}
                    rowNumSetter={setRowNum}
                ></TransSpectrophotometerBody>
            </Widget>
        </GridElement>
    )
}