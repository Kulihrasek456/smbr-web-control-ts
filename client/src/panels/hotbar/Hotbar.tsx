import { createEffect, createSignal, onCleanup, onMount, Show } from 'solid-js';
import { ApiFetcher } from '../../common/ApiFetcher/ApiFetcher'
import { formatTime } from '../../common/other/utils';

import styles from './Hotbar.module.css'
import { countInstancesOfType, useModuleListValue } from '../../common/other/ModuleListProvider';
import type { apiMessageSimple } from '../../apiMessages/apiMessageSimple';
import { refreshValueUpdate, useRefreshValue } from '../../common/other/RefreshProvider';
import { ValueDisplay } from '../../common/ApiFetcher/ValueDisplay';
import { System } from '../../apiMessages/system/_';


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
    const refreshCntxt = useRefreshValue;
    const [countsErrs, setCountsErrs] = createSignal<{err: boolean, count: number | undefined}>({err:false,count:undefined});
    const [countsWarns, setCountsWarns] = createSignal<{err: boolean, count: number | undefined}>({err:false,count:undefined});
    const [error, setError] = createSignal<boolean>(false);

    onMount(()=>{
        let id = setInterval(()=>{
            setTime(new Date())
        },100)

        onCleanup(()=>{
            clearInterval(id);
        })
    })

    async function refreshCountsErrs(){
        try {
            setCountsErrs({
                err: false,
                count: (await System.sendErrors()).problems.length
            });
        } catch (error) {
            setCountsErrs({
                err: true,
                count: undefined
            });
        }
        
    }
    async function refreshCountsWarns(){
        try {
            setCountsWarns({
                err: false,
                count: (await System.sendWarnings()).problems.length
            });
        } catch (error) {
            setCountsWarns({
                err: true,
                count: undefined
            });
        }
    }

    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntxt())){
            return;
        }
        refreshCountsErrs();
        refreshCountsWarns();
    })

    return (
        <>
            <div classList={{
                [styles.state_display]:true,
                [styles.twoRowContainer]:true,
                [styles.errors]:    (countsErrs().count  ?? 0) > 0,
                [styles.warnings]:  (countsWarns().count ?? 0) > 0
            }}
            >
                <div class={styles.flex_row + " " + styles.bold}>
                    <p>Errors: </p>
                    <ValueDisplay 
                        value={countsErrs().count?.toString()}
                        error={countsErrs().err}
                    ></ValueDisplay>
                </div>
                <div class={styles.flex_row + " " + styles.bold}>
                    <p>Warnings: </p>
                    <ValueDisplay 
                        value={countsWarns().count?.toString()}
                        error={countsWarns().err}
                    ></ValueDisplay>
                </div>
            </div>
            <div class={styles.twoRowContainer}>
                <p>{formatTime("hh:MM",time())}</p>
                <p>{formatTime("dd.mo. yyyy",time())}</p>
            </div>      
            <Show when={countInstancesOfType(moduleListCntxt?.state(),"core","Exclusive")}>
                <SimpleDisplay name='hostname' target={{url: "/core/hostname", key: "hostname"}}></SimpleDisplay>
                <SimpleDisplay name='IP adress' target={{ url: "/core/ip_address", key: "ipAddress" }}></SimpleDisplay>
                <SimpleDisplay name='short ID' target={{url: "/core/sid", key: "sid"}}></SimpleDisplay>
            </Show>  
        </>
    )
}