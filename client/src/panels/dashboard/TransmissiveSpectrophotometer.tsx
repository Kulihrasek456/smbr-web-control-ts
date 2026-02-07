import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { TableStatic } from "../../common/Table/Table";
import { Widget } from "../common/Widget";
import { Icon } from "../../common/Icon/Icon";
import { createSignal } from "solid-js";
import { Button } from "../../common/Button/Button";

interface TransSpectrophotometerProps{
    id: string;
}

type row = {
    color: string,
    frequency: number,
    name: string
}


export function TransSpectrophotometer(props: TransSpectrophotometerProps){
    const [rows, setRows] = createSignal<row[]>([
        {color:"#6F00FF",frequency:430,name:"UV"},
        {color:"#007FFF",frequency:480,name:"Blue"},
        {color:"#00FF00",frequency:560,name:"Green"},
        {color:"#FF7F00",frequency:630,name:"Orange"},
        {color:"#FF0000",frequency:678,name:"Red"},
        {color:"#800000",frequency:870,name:"IR"},
    ])
    
    
    function renderRow(value : row, index: number){
        return ([
            <Icon name="circle" color={value.color}></Icon>,
            <p>{value.frequency + " nm"}</p>,
            <p style={{"justify-content":"left"}}>{value.name}</p>,
            <p>---</p>,
            <p>---</p>
        ])
    }

    return (
        <GridElement id={props.id} w={1} h={Math.round(rows().length/3)+1}>
            <Widget name="Transmissive spectrophotometer">
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
            </Widget>
        </GridElement>
    )
}