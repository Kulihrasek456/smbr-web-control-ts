import { createSignal, onCleanup, onMount } from 'solid-js'
import { apiMessageSimple } from '../apiMessages/apiMessage'

import styles from './ApiFetcher.module.css'

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
    const [value, setValue] = createSignal<string | undefined>(" ");

    const fetchData = async () => {
        try {
            await target.send()
            setValue(target.getValue().toString());
        } catch (e) {
            setValue(undefined);
        }
    };

    onMount(() => {
        fetchData()

        const id = setInterval(fetchData, interval);

        onCleanup(() => clearInterval(id));
    });

    return (
        <span class={`${value() ? "" : styles.error} ${styles.fetcher}`}>
            {value() ? value() + (unit ?? "") : "err"}
        </span>
    );
}