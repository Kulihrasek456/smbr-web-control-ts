import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'

import styles from './ApiFetcher.module.css'
import { useRefreshValue } from '../other/RefreshProvider';
import { sendApiMessageSimple, type apiMessageSimple } from '../../apiMessages/apiMessageSimple';

export interface ApiFetcherProps{
    target: apiMessageSimple;
    unit?: string,
    interval?: number,
    numberOnly?: {
        decimalPlaces :number
    }
};


export function ApiFetcher(props: ApiFetcherProps) {
    const undefinedPlaceholder = "---"

    const [value, setValue] = createSignal<string | undefined>(undefinedPlaceholder);
    const refreshValue = useRefreshValue

    createEffect(async () => {
        let val = refreshValue?.();
        if(!val || val()._ts == 0){
            return
        }
        try {
            setValue(((await sendApiMessageSimple(props.target)).toString()));
        } catch (e) {
            setValue(undefined);
            console.error(e);
        }
    })

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
        <p class={`${value() ? "" : styles.error} ${styles.fetcher}`}>
            <Show when={value()} fallback="err">
                {renderValue(value())}
                <Show when={props.unit}>
                    <span class={styles.fetcher_unit}>{props.unit}</span>
                </Show>
            </Show>
        </p>
    );
}