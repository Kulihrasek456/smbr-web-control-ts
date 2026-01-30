import { children, Show } from "solid-js";
import type { JSX, JSXElement } from "solid-js";

import { Icon } from "../../common/Icon/Icon";
import { Button } from "../../common/Button/Button";

import styles from './Widget.module.css'
import { ApiFetcher, type ApiFetcherProps } from "../../common/ApiFetcher/ApiFetcher";
import { RefreshProvider, useRefreshTrigger } from "../../common/other/RefreshProvider";


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

function WidgetRefreshButton() {
    const triggerRefresh = useRefreshTrigger();
    return (
        <Button callback={async (): Promise<boolean> => {triggerRefresh?.({forced:true,_ts:Date.now()}); return true;}}>
            <Icon name="autorenew"></Icon>
        </Button>
    )
}


interface WidgetProps {
    children?: JSX.Element;
    hotbarTargets?: () => JSXElement;
    name: string;
}

export function Widget(props: WidgetProps) {
    return (
        <RefreshProvider>
            <div class={styles.container}>
                <div class={styles.header + " resize-handle"}>
                    <h2>{props.name}</h2>
                    <div class={styles.hotbarPanel}>
                        <Show when={props.hotbarTargets} fallback={<></>}>
                            {props.hotbarTargets?.()}
                        </Show>
                        <WidgetRefreshButton></WidgetRefreshButton>
                    </div>
                </div>
                <div class="popup-container">
                </div>
                <div class={styles.body}>
                    {props.children}
                </div>
            </div>
        </RefreshProvider>
    );
}