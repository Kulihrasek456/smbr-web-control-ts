import { Show } from "solid-js";
import styles from "./ValueDisplay.module.css"
import { isNumber } from "../other/utils";

export interface ValueDisplayProps{
    value: string | undefined
    unit?: string,
    error? : boolean
    numberOnly?: {
        decimalPlaces :number,
        resultModifier? : (value: number)=>number
    }
    class?: string,
    resultModifier? : (value:string )=>string
}

export function ValueDisplay(props:ValueDisplayProps){
    const undefinedPlaceholder = "---"

    function renderValue(val : string | undefined) : string{
        if(!val){
            return undefinedPlaceholder
        }
        if(props.numberOnly){
            let result : number = Number(val)
            if(!isNumber(result)){
                console.warn("value: ",val," is not a number!");
                return undefinedPlaceholder
            }
            if(props.numberOnly.resultModifier){
                result = props.numberOnly.resultModifier(result);
            }
            if(props.numberOnly.decimalPlaces == 0){
                return Math.round(result).toString()
            }else{
                return result.toFixed(props.numberOnly.decimalPlaces)
            }
        }
        return val;
    }

    return (
        <p 
            class = {props.class}
            classList={{
                [styles.error]:props.error === true,
                [styles.fetcher]:true
            }}
        >
            <Show when={props.error} fallback={
                <Show when={props.value} fallback={undefinedPlaceholder}>
                    {renderValue(props.value)}
                    <Show when={props.unit}>
                        <span class={styles.fetcher_unit}>{props.unit}</span>
                    </Show>
                </Show>
            }>
                <span>Err</span>
            </Show>
        </p>
    );
}