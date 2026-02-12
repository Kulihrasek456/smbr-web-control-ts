import { createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Slider, SliderApiControl } from "../../common/Slider/Slider"
import { Widget } from "../common/Widget"
import { ValueController } from "../../common/ValueController/ValueControlller"

import { enforceMinMax } from "../../common/other/inputFilters"
import styles from "./Control.module.css"


interface ControlProps{
    id : string
}
export function Control(props : ControlProps){
    const [value, setValue] = createSignal(0)

    return (
        <GridElement id={props.id} w={1} h={5}>
            <Widget name="Control">
                <div
                    class={styles.container} 
                    style={{
                        display: "flex",
                        "flex-direction": "column",
                        flex: "1 0 auto",
                        gap: "10px"
                    }}
                >
                    <SliderApiControl 
                        target={{
                            getter: {url:"/control/aerator/speed", key:"speed"}
                        }}
                        title="Aerator" 
                        direction="H"
                        bounds={{min: 0, max: 1}} 
                        step={0.05}
                    ></SliderApiControl>
                    
                    <SliderApiControl
                        target={{
                            getter: {url:"/control/mixer/speed", key:"speed"}
                        }}
                        title="Mixer" 
                        direction="H" 
                        bounds={{min: 0, max: 1}} 
                        step={0.05}
                    ></SliderApiControl>
                    
                    <SliderApiControl 
                        target={{
                            getter: {url:"/control/cuvette_pump/speed", key:"speed"}
                        }}
                        title="Cuvette pump" 
                        direction="H" 
                        bounds={{min: -1, max: 1}} 
                        step={0.05}
                    ></SliderApiControl>

                    <ValueController
                        title="Mixer target rpm"
                        valueName="current target"
                        buttonText="turn off"
                        inputPlaceholder="0-10000 rpm"
                        getter={value}
                        setter={setValue}
                    ></ValueController>

                    <SliderApiControl 
                        target={{
                            getter: {url:"/control/heater/intensity", key:"intensity"}
                        }}
                        title="Heater" 
                        direction="H" 
                        bounds={{min: -1, max: 1}} 
                        step={0.05}
                    ></SliderApiControl>

                    <ValueController
                        title="Heater target temperature"
                        valueName="current target"
                        buttonText="turn off"
                        inputPlaceholder="0-90 °C"
                        getter={value}
                        setter={setValue}
                    ></ValueController>
                </div>
            </Widget>
        </GridElement>
    )
}