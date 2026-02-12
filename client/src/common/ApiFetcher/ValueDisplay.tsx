import { Show } from "solid-js";
import styles from "./ValueDisplay.module.css"

interface ValueDisplayProps{
    value: string
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
            if(isNaN(result)){
                return undefinedPlaceholder
            }
            return result.toFixed(props.numberOnly.decimalPlaces)
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