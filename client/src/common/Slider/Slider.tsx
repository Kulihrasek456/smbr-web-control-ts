import styles from "./Slider.module.css"
import { createEffect, createSignal, Show } from "solid-js"
import { mapRangeToRange } from "../other/utils"
import { isChromium, isSafari } from "@solid-primitives/platform";
import { useRefreshValue } from "../other/RefreshProvider";
import { sendApiMessageSimple, sendApiMessageSimplePost, type apiMessageSimple } from "../../apiMessages/apiMessageSimple";

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
    decimals?:number,
    step? : number,
    unit? : string,
    onChange? : (value : number)=>void,
    onInput? : (value : number)=>void,
    displayModifier? : (value : number)=>number
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
                <p class={styles.value}>{
                    ((props.displayModifier)?(
                        props.displayModifier(props.getter())
                    ):(
                        props.getter()
                    )).toFixed(props.decimals??2)
                    
                    + (props.unit ?? " ")
                }</p>
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
                    onInput={e => {props.setter(+e.currentTarget.value); props.onInput?.(+e.currentTarget.value)}}
                    onChange={e=>{props.onChange?.(+e.currentTarget.value)}}
                ></input>
            </div>
        </div>
    )
}

interface SliderApiControlProps{
    title: string,
    direction: "H"|"V"
    target:{
        getter: apiMessageSimple
        setter?: apiMessageSimple
    }
    class?:string,
    bounds : {
        min : number,
        max : number,
        show? : boolean
    }
    decimals?:number,
    step?:number,
    unit?:string,
    minInterval?:number,
    imidiateStops?:number[]
    displayModifier? : (value : number)=>number
}

export function SliderApiControl(props : SliderApiControlProps){
    const [value,setValue] = createSignal<number>(0);
    const refreshCntx = useRefreshValue()

    let currentState : "setting" | "idle" = "idle"
    let lastChange = 0;

    createEffect(async ()=>{
        if(!refreshCntx || refreshCntx()._ts == 0){
            return
        }
        if(currentState==="idle"){
            let response = await sendApiMessageSimple(props.target.getter);
    
            setValue(+response);
        }
    })

    async function sendValue(value : number){
        await sendApiMessageSimplePost(props.target.setter ?? props.target.getter,value);
    }

    function onInput(value : number){
        setValue(value);

        if(Date.now() > (props.minInterval??100)+lastChange){
            lastChange = Date.now();
            sendValue(value);
        }else{
            if((props.imidiateStops??[props.bounds.min,props.bounds.max]).includes(value)){
                sendValue(value);
            }
        }
    }
    function onChange(value : number){
        sendValue(value)
    }

    return (
        <Slider
            title={props.title}
            direction={props.direction}
            class={props.class}
            bounds={props.bounds}
            step={props.step}
            unit={props.unit}
            displayModifier={props.displayModifier}
            getter={value}
            setter={setValue}

            decimals={props.decimals}

            onChange={onChange}
            onInput={onInput}
        ></Slider>
    )
}