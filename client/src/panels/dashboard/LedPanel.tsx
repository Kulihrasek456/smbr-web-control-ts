import { createSignal, For, type Accessor, type Setter } from "solid-js";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { Slider } from "../../common/Slider/Slider";
import { Widget } from "../common/Widget";

import styles from "./LedPanel.module.css"

interface LEDPanelProps{
    id: string;
}

export function LEDPanel(props: LEDPanelProps){
    
    let data : {signal:[Accessor<number>,Setter<number>]}[] = []
    for(let i=0; i<4; i++){
        data.push(
            {
                signal: createSignal(0)
            }
        )
    }

    return (
        <GridElement id={props.id} w={1} h={3}>
            <Widget name="LED panel">
                <div class={styles.container}>
                    <For each={data}>
                        {(el,index)=>(
                            <Slider
                                class={styles.slider}
                                direction="V"
                                title={"Channel " + index()} 
                                bounds={{ min: 0, max: 100, show: false }}
                                getter={el.signal[0]}
                                setter={el.signal[1]}
                            ></Slider>
                        )}
                    </For>
                </div>
            </Widget>
        </GridElement>
    )
}