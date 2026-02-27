import { createSignal } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Slider, SliderApiControl } from "../../common/Slider/Slider"
import { Widget } from "../common/Widget"
import { ValueController, ValueControllerApiControl } from "../../common/ValueController/ValueControlller"

import { enforceMinMax } from "../../common/other/inputFilters"
import styles from "./Control.module.css"
import { sendApiMessage } from "../../apiMessages/apiMessageBase"
import { Sensor_Heater } from "../../apiMessages/sensor/heater"


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

                    <ValueControllerApiControl
                        title="Mixer target rpm"
                        buttonTooltip="turn off the mixer"
                        valueName="current target"
                        buttonText="turn off"
                        min={0}
                        max={10000}
                        unit="rpm"
                        getter={{url:"/control/mixer/rpm",key:"rpm"}}
                        onClick={async (value : number | undefined)=>{
                            sendApiMessage({url:"/control/mixer/stop"});
                        }}
                    ></ValueControllerApiControl>

                    <SliderApiControl 
                        target={{
                            getter: {url:"/control/heater/intensity", key:"intensity"}
                        }}
                        title="Heater" 
                        direction="H" 
                        bounds={{min: -1, max: 1}} 
                        step={0.05}
                    ></SliderApiControl>

                    <ValueControllerApiControl
                        title="Heater target temperature"
                        valueName="current target"
                        buttonTooltip="turn off the heater"
                        buttonText="turn off"
                        min={0}
                        max={90}
                        unit="°C"
                        getter={{url:"/control/heater/target_temperature",key:"temperature"}}
                        onClick={async (value : number | undefined)=>{
                            sendApiMessage({url:"/control/heater/turn_off"});
                        }}
                        getValueFunction={async ()=>((await Sensor_Heater.sendGetTarget()).targetTemp)}
                    ></ValueControllerApiControl>
                </div>
            </Widget>
        </GridElement>
    )
}