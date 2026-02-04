import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { apiMessageSimple } from '../../apiMessages/apiMessage'

import styles from './ApiFetcher.module.css'
import { useRefreshValue } from '../other/RefreshProvider';

export interface ApiFetcherProps{
    target: apiMessageSimple;
    unit?: string,
    interval?: number,
};


export function ApiFetcher({
    target,
    interval = 5000,
    unit,
}: ApiFetcherProps) {
    const [value, setValue] = createSignal<string | undefined>("---");
    const refreshValue = useRefreshValue

    createEffect(async () => {
        let val = refreshValue?.();
        if(!val || val()._ts == 0){
            return
        }
        try {
            await target.send()
            setValue(target.getValue().toString());
        } catch (e) {
            setValue(undefined);
        }
    })

    return (
        <span class={`${value() ? "" : styles.error} ${styles.fetcher}`}>
            <Show when={value()} fallback="err">
                {value()}
                <span class={styles.fetcher_unit}>{unit}</span>
            </Show>
        </span>
    );
}