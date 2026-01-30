import { createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Slider } from "../../common/Slider/Slider"
import { Widget } from "../common/Widget"
import { ValueController } from "../../common/ValueController/ValueControlller"

import { enforceMinMax } from "../../common/other/inputFilters"


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
                    flex: "1 0 auto",
                    gap: "10px"
                }}>
                    <Slider setter={setValue} getter={value} title="test" direction="H" bounds={{min: 0, max: 100}}></Slider>
                    <Slider setter={setValue} getter={value} title="test" direction="H" bounds={{min: 4, max: 15}}></Slider>
                    <div style={{
                        display: "flex",
                        "flex-direction" : "row",
                        flex: "1 0 auto",
                        gap: "10px"
                    }}>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15}}></Slider>
                        <Slider setter={setValue} getter={value} title="test" direction="V" bounds={{min: 4, max: 15, show: false}}></Slider>
                        <Slider setter={setValue} getter={value} title="long text" direction="V" bounds={{min: 4, max: 15, show: false}}></Slider>
                    </div>

                    <ValueController inputFilter={(value : string) => {return enforceMinMax(value, -15, 15)}} setter={setValue} getter={value} title="test" valueName="testval" buttonText="set"></ValueController>
                </div>
            </Widget>
        </GridElement>
    )
}