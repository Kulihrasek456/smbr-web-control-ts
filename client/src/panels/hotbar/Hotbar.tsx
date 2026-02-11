import { createSignal, onCleanup, onMount, Show } from 'solid-js';
import { ApiFetcher } from '../../common/ApiFetcher/ApiFetcher'
import { formatTime } from '../../common/other/utils';

import styles from './Hotbar.module.css'
import { countInstancesOfType, useModuleListValue } from '../../common/other/ModuleListProvider';
import type { apiMessageSimple } from '../../apiMessages/apiMessageSimple';


type SimpleDisplayProps = {
    name: string,
    target: apiMessageSimple,
};

function SimpleDisplay({ name, target }: SimpleDisplayProps) {
    return (
        <div class={styles.twoRowContainer + " " + styles.bold}>
            <p>{name+ ":"}</p>
            <ApiFetcher target={target}></ApiFetcher>
        </div>
    )
}

export function Hotbar() {
    const [time, setTime] = createSignal(new Date());
    const moduleListCntxt = useModuleListValue();

    onMount(()=>{
        let id = setInterval(()=>{
            setTime(new Date())
        },100)

        onCleanup(()=>{
            clearInterval(id);
        })
    })

    return (
        <>
            <div class={styles.state_display + " " +styles.twoRowContainer}>
                <div class={styles.flex_row + " " + styles.bold}><p>Errors: </p><p>1</p></div>
                <div class={styles.flex_row + " " + styles.bold}><p>Warnings: </p><p>1</p></div>
            </div>
            <div class={styles.twoRowContainer}>
                <p>{formatTime("hh:MM",time())}</p>
                <p>{formatTime("dd.mo. yyyy",time())}</p>
            </div>      
            <Show when={countInstancesOfType(moduleListCntxt?.state(),"core","Exclusive")}>
                <SimpleDisplay name='hostname' target={{url: "/core/hostname", key: "hostname"}}></SimpleDisplay>
                <SimpleDisplay name='IP adress' target={{url: "/core/ip_address", key: "ipAdress"}}></SimpleDisplay>
                <SimpleDisplay name='short ID' target={{url: "/core/sid", key: "sid"}}></SimpleDisplay>
            </Show>  
        </>
    )
}