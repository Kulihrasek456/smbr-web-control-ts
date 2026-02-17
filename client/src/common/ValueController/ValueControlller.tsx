import { createEffect, createSignal } from "solid-js";
import styles from "./ValueController.module.css"
import { sendApiMessageSimple, sendApiMessageSimplePost, type apiMessageSimple } from "../../apiMessages/apiMessageSimple";
import { isNumber } from "chart.js/helpers";
import { enforceMax, enforceMin } from "../other/inputFilters";
import { ValueDisplay } from "../ApiFetcher/ValueDisplay";
import { refreshValueUpdate, useRefreshValue } from "../other/RefreshProvider";

//#TODO this implementation is not pretty. It should be refractored in the near future.

interface ValueControllerProps{
    title : string,
    valueName : string,
    buttonText : string,
    unit? : string,
    
    getter : () => number | undefined,
    setter : (value : number | undefined) => void,

    onSubmit? : (value : number | undefined)=>void,
    onChange? : (value : number | undefined)=>void,
    onInput? : (value : number | undefined)=>void,
    onClick? : () => void

    min?: number;
    max?: number;
}

function getInputPlaceholder(min?:number,max?:number,unit?:string){
    let unitStr = unit?(" " + unit):"";
    if(isNumber(min) && isNumber(max)){
        return `${min} - ${max}${unitStr}`
    }
    if(isNumber(min)){
        return `≤ ${max}${unitStr}`
    }
    if(isNumber(max)){
        return `≥ ${min}${unitStr}`
    }
}

export function ValueController(props : ValueControllerProps){
    let inputField : HTMLInputElement | undefined;

    return (
        <div class={styles.container}>
            <div class={styles.top}>
                <p class={styles.label}>
                    {props.title}
                </p>
                <p class={styles.valueLabel}>
                    {(props.valueName || "current value") + ": "}
                    <ValueDisplay class={styles.value} value={props.getter?.()?.toString() ?? "---"} numberOnly={{decimalPlaces: 2}} unit={props.unit}></ValueDisplay>
                </p>
            </div>
            <div class={styles.bottom}>
                <button class="button" onClick={props.onClick}>{props.buttonText}</button>
                <div class={styles["input-container"]}>
                    <input 
                        class={"button " + styles.input}
                        type="text"
                        ref={inputField}
                        placeholder={
                            getInputPlaceholder(props.min,props.max,props.unit)
                        }
                        onInput={e => {
                            if(isNumber(props.max)){
                                e.currentTarget.value = enforceMax(e.currentTarget.value,props.max);
                            }
                            props.onInput?.(props.getter());
                        }}
                        onChange={e => {
                            if(isNumber(props.min)){
                                e.currentTarget.value = enforceMin(e.currentTarget.value,props.min);
                            }
                            props.onChange?.(props.getter());
                        }}
                    ></input>

                    <button 
                        class={"button " + styles["set-button"]}
                        onClick={e => {
                            if(inputField){
                                if(inputField.value!=""){
                                    let val = +inputField.value;
                                    props.setter(val);
                                    props.onSubmit?.(val);
                                }
                            }
                        }}
                    >set</button>
                </div>
            </div>
        </div>
    )
}

interface ValueControllerApiControl{
    title : string,
    valueName : string,
    buttonText : string,
    unit? : string,

    getter: apiMessageSimple,
    setter?: apiMessageSimple,

    onClick: (value: number | undefined) => Promise<void>

    min?: number;
    max?: number;
}

export function ValueControllerApiControl(props : ValueControllerApiControl){
    const [value, setValue] = createSignal<number | undefined>(undefined);
    const refreshCntx = useRefreshValue;

    async function refreshValue(){
        try {
            let response = await sendApiMessageSimple(props.getter);
            if(isNumber(response)){
                setValue(response);
            }else{
                throw Error("invalid return value");
            }
        } catch (error) {
            setValue(undefined);
        }
    }

    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntx())){
            return
        }
        await refreshValue();
    })

    async function onSubmit(value: number | undefined){
        let response = await sendApiMessageSimplePost(props.setter ?? props.getter,value);
        await refreshValue();
    }
    async function onClick(){
        await props.onClick(value());
        await refreshValue();
    }

    return (
        <ValueController
            title={props.title}
            valueName={props.valueName}
            buttonText={props.buttonText}

            unit={props.unit}
            min={props.min}
            max={props.max}

            getter={value}
            setter={(value)}

            onClick={onClick}

            onSubmit={onSubmit}
        
        ></ValueController>
    )
}