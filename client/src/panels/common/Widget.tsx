import { children } from "solid-js";
import type { JSX, JSXElement } from "solid-js";

import { Icon } from "../../common/Icon";
import { Button } from "../../common/Button";
import type { ButtonProps } from "../../common/Button"

import styles from './Widget.module.css'
import { ApiFetcher, type ApiFetcherProps } from "../../common/ApiFetcher";


interface WidgetHotbarValueProps {
    name:string,
    apiFetcherProps: ApiFetcherProps
}

export function WidgetHotbarValue(props: WidgetHotbarValueProps){
    return (
        <div class={styles.apiValue}>
            <p>{props.name}</p>
            <ApiFetcher target={props.apiFetcherProps.target} interval={props.apiFetcherProps.interval} unit={props.apiFetcherProps.unit}></ApiFetcher>
        </div>
    )
}

interface WidgetProps {
    children?: JSX.Element;
    hotbarTargets: () => JSXElement;
    name: string;
    refreshCallback?: ButtonProps
}

export function Widget(props: WidgetProps) {
    const c = children(() => props.children);

    return (
        <div class={styles.container}>
            <div class={styles.header}>
                <h2>{props.name}</h2>
                <div class={styles.hotbarPanel}>
                    {props.hotbarTargets()}
                    {props.refreshCallback && (
                        <Button callback={props.refreshCallback.callback}>
                            <Icon name="autorenew"></Icon>
                        </Button>
                    )}
                </div>
            </div>
            <div class="popup-container">
            </div>
            <div class={styles.body}>
                {c()}
            </div>
        </div>
    );
}