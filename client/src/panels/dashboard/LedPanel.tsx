import { createSignal, For, type Accessor, type Setter } from "solid-js";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { Slider, SliderApiControl } from "../../common/Slider/Slider";
import { Widget } from "../common/Widget";

import styles from "./LedPanel.module.css"
import { Button } from "../../common/Button/Button";
import { sendApiMessage, sendJsonApiMessage } from "../../apiMessages/apiMessageBase";

interface LEDPanelProps{
    id: string;
}

export function LEDPanel(props: LEDPanelProps){
    const channels = [
        0,
        1,
        2,
        3
    ]
    return (
        <GridElement id={props.id} w={1} h={3}>
            <Widget 
                name="LED panel"
                hotbarTargets={()=>(
                    <>
                        <Button callback={async ()=>{
                            await sendJsonApiMessage({
                                url: "/control/led_panel/intensity",
                                method: "POST",
                                data: "{\"intensity\": [0,0,0,0]}"
                            })
                            return true;
                        }}>disable</Button>
                    </>
                )}
            >
                <div class={styles.container}>
                    <For each={channels}>
                        {(el,index)=>(
                            <SliderApiControl
                                class={styles.slider}
                                direction="V"
                                title={"Channel " + el}
                                bounds={{ min: 0, max: 1, show: false }}
                                step={0.01}
                                minInterval={100}
                                unit="%"
                                displayModifier={value=>(Math.round(value*100))}
                                
                                target={{
                                    getter:{url:"/control/led_panel/intensity/"+el,key:"intensity"},
                                    setter:{url:"/control/led_panel/intensity/"+el,key:"intensity"}
                                }}
                            ></SliderApiControl>
                        )}
                    </For>
                </div>
            </Widget>
        </GridElement>
    )
}