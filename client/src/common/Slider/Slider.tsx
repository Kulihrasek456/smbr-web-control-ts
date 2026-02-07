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

interface SliderSimpleProps{
    direction : "H"|"V";
    bounds : {
        min : number,
        max : number
    };
    setter : (value: number) => void;
    getter : () => number;
    step? : number
}

export function SliderSimple(props:SliderSimpleProps){
    return (
        <input 
            class={styles.slider + " " + styles[props.direction]}
            type="range"
            min={props.bounds.min}
            max={props.bounds.max}
            value={props.getter()}
            step={props.step}
            onInput={e => {props.setter(+e.currentTarget.value); chromeFix_Slider(e.currentTarget,props.direction == "V")}}
        ></input>
    )
}


interface SliderProps{
    title : string,
    direction : "H"|"V",
    class? : string,
    setter : (value: number) => void,
    getter : () => number,
    bounds : {
        min : number,
        max : number,
        show? : boolean
    }
    step? : number,
    unit? : string,
    onChange? : (value : number)=>void,
    onInput? : (value : number)=>void,
    displayModifier? : (apiResult : number|string|null)=>string
}

export function Slider(props : SliderProps){
    let slider : HTMLInputElement | undefined = undefined;

    if(isChromium || isSafari){
        createEffect(() => {
            if(slider){
                props.getter();
                chromeFix_Slider(slider,props.direction == "V");
            }
        })
    }

    return (
        <div class={styles.container + " " + styles[props.direction] + " "+props.class}>
            <div class={styles.header}>
                <p class={styles.label}>{props.title}</p>
                <p class={styles.value}>{props.getter() + (props.unit || "")}</p>
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
                    value={props.getter()}
                    step={props.step}
                    onInput={e => {props.setter(+e.currentTarget.value)}}
                ></input>
            </div>
        </div>
    )
}