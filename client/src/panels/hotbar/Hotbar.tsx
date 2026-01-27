import { apiMessageSimple } from '../../apiMessages/apiMessage'
import { ApiFetcher } from '../../common/ApiFetcher'

import styles from './Hotbar.module.css'


type SimpleDisplayProps = {
    name: string,
    target: apiMessageSimple,
};

function SimpleDisplay({ name, target }: SimpleDisplayProps) {
    return (
        <div class={styles.twoRowContainer + " " + styles.bold}>
            <p>{name}</p>
            <ApiFetcher target={target}></ApiFetcher>
        </div>
    )
}

export function Hotbar() {
    return (
        <>
            <div class={styles.twoRowContainer}>
                <p>{(new Date()).toDateString()}</p>
                <p>{(new Date()).toLocaleTimeString()}</p>
            </div>        
            <SimpleDisplay name='hostname' target={new apiMessageSimple("/core/hostname", "hostname")}></SimpleDisplay>
            <SimpleDisplay name='IP adress' target={new apiMessageSimple("/core/ip_address", "ipAdress")}></SimpleDisplay>
            <SimpleDisplay name='short ID' target={new apiMessageSimple("/core/sid", "sid")}></SimpleDisplay>
        </>
    )
}