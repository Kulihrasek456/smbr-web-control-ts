import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Slider } from "../../common/Slider/Slider"
import { Widget } from "../common/Widget"

interface ControlProps{
    id : string
}
export function Control(props : ControlProps){
    return (
        <GridElement id={props.id} h={5}>
            <Widget name="Control">
                <div style={{
                    display: "flex",
                    "flex-direction": "column"
                }}>
                    <Slider title="test" direction="H" bounds={{min: 0, max: 100}}></Slider>
                    <Slider title="test" direction="H" bounds={{min: 4, max: 15}}></Slider>
                    <div style={{
                        display: "flex",
                        "flex-direction" : "row"
                    }}>
                        <Slider title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                    </div>
                </div>
            </Widget>
        </GridElement>
    )
}