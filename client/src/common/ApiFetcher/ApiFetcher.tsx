import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js'

import styles from './ApiFetcher.module.css'
import { useRefreshValue } from '../other/RefreshProvider';
import { sendApiMessageSimple, type apiMessageSimple } from '../../apiMessages/apiMessageSimple';

export interface ApiFetcherProps{
    target: apiMessageSimple;
    unit?: string,
    interval?: number,
};


export function ApiFetcher(props: ApiFetcherProps) {
    const [value, setValue] = createSignal<string | undefined>("---");
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

    return (
        <span class={`${value() ? "" : styles.error} ${styles.fetcher}`}>
            <Show when={value()} fallback="err">
                {value()}
                <Show when={props.unit}>
                    <span class={styles.fetcher_unit}>{props.unit}</span>
                </Show>
            </Show>
        </span>
    );
}