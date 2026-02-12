import { Show } from "solid-js";
import styles from "./ValueDisplay.module.css"
import { isNumber } from "../other/utils";

interface ValueDisplayProps{
    value: string | undefined
    unit?: string,
    numberOnly?: {
        decimalPlaces :number
    }
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
            if(props.numberOnly.decimalPlaces == 0){
                return Math.round(result).toString()
            }else{
                return result.toFixed(props.numberOnly.decimalPlaces)
            }
        }
        return val;
    }

    return (
        <p class={`${props.value ? "" : styles.error} ${styles.fetcher}`}>
            <Show when={props.value} fallback="err">
                {renderValue(props.value)}
                <Show when={props.unit}>
                    <span class={styles.fetcher_unit}>{props.unit}</span>
                </Show>
            </Show>
        </p>
    );
}