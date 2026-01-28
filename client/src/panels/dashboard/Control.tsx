import { createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Slider } from "../../common/Slider/Slider"
import { Widget } from "../common/Widget"

interface ControlProps{
    id : string
}
export function Control(props : ControlProps){
    const [value, setValue] = createSignal(0)

    return (
        <GridElement id={props.id} h={5}>
            <Widget name="Control">
                <div style={{
                    display: "flex",
                    "flex-direction": "column",
                    flex: "1 0 auto"
                }}>
                    <Slider setter={setValue} getter={value} title="test" direction="H" bounds={{min: 0, max: 100}}></Slider>
                    <Slider setter={setValue} getter={value} title="test" direction="H" bounds={{min: 4, max: 15}}></Slider>
                    <div style={{
                        display: "flex",
                        "flex-direction" : "row",
                        flex: "1 0 auto"
                    }}>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15, show: false}}></Slider>
                        <Slider setter={setValue} getter={value} title="long long long text" direction="V" bounds={{min: 4, max: 15, show: false}}></Slider>
                    </div>
                </div>
            </Widget>
        </GridElement>
    )
}