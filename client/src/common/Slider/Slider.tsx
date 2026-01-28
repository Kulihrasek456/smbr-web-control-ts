import { apiMessageSimple } from "../../apiMessages/apiMessage"
import styles from "./Slider.module.css"
import { createEffect, createSignal, Show } from "solid-js"
import { mapRangeToRange } from "../other/utils"
import { isChromium, isSafari } from "@solid-primitives/platform";

function chromeFix_Slider(element : HTMLInputElement, vertical : boolean){
    if((window.webkitURL != null)){
        const progress = mapRangeToRange(+element.value,Number(element.getAttribute("max")),Number(element.getAttribute("min")),100,0) 
        if(vertical){
            element.style.background = "linear-gradient(0deg, var(--acc-color-2) "+progress+"%, var(--bg-color-3) "+progress+"%)";
        }else{
            element.style.background = "linear-gradient(90deg, var(--acc-color-2) "+progress+"%, var(--bg-color-3) "+progress+"%)";
        }
    }
}

interface SliderHProps{
    title : string,
    direction : "H"|"V",
    initValue? : number,
    bounds : {
        min : number,
        max : number,
        show? : boolean
    }
    step? : number,
    unit? : string,
    remoteTarget? : apiMessageSimple,
    onChange? : (value : number)=>void,
    onInput? : (value : number)=>void,
    displayModifier? : (apiResult : number|string|null)=>string
}

export function Slider(props : SliderHProps){
    let slider : HTMLInputElement | undefined = undefined;
    const [value, setValue] = createSignal(props.initValue || (((props.bounds.min || 0) + (props.bounds.max || 0))/2))

    if(isChromium || isSafari){
        createEffect(() => {
            if(slider){
                value();
                chromeFix_Slider(slider,props.direction == "V");
            }
        })
    }

    return (
        <div class={styles.container + " " + styles[props.direction]}>
            <div class={styles.header}>
                <p class={styles.label}>{props.title}</p>
                <p class={styles.value}>{value() + (props.unit || "")}</p>
            </div>
            <div class={styles.body}>
                <Show when={props.bounds.show!=undefined?props.bounds.show:true}>
                    <div class={styles.minmax}>
                        <p>{props.bounds.min}</p>
                        <p>{props.bounds.max}</p>
                    </div>
                </Show>
                <input 
                    class={styles.slider + " " + styles[props.direction]}
                    ref={slider}
                    type="range"
                    min={props.bounds.min}
                    max={props.bounds.max}
                    value={value()}
                    onInput={e => {setValue(+e.currentTarget.value)}}
                ></input>
            </div>
        </div>
    )
}