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
        <Button 
            callback={async (): Promise<boolean> => {triggerRefresh?.({forced:true,_ts:Date.now()}); return true;}}
            tooltip="Refresh values"
        >
            <Icon scale={1.2} name="autorenew"></Icon>
        </Button>
    )
}

function RefreshProviderWrapper(props : {wrap : boolean, children : any}){
    return(
        <Show when={props.wrap} fallback={props.children}>
            <RefreshProvider>
                {props.children}
            </RefreshProvider>
        </Show>
    )
}


interface WidgetProps {
    children?: JSX.Element;
    hotbarTargets?: () => JSXElement;
    name: string;
    customRefreshProvider?: boolean;
}

export function Widget(props: WidgetProps) {
    return (
        <RefreshProviderWrapper wrap={!(props.customRefreshProvider ?? false)}>
            <div class={styles.container}>
                <div class={styles.header}>
                    <div class={styles["drag-handle"] + " drag-handle"}>
                        <Icon name="open_with"></Icon>
                    </div>
                    <h2 class={styles.title}>{props.name}</h2>
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
        </RefreshProviderWrapper>
    );
}