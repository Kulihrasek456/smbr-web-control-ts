import { createEffect, createSignal, For } from "solid-js";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import type { Module, moduleInstancesType } from "../../common/other/ModuleListProvider";
import { SliderApiControl } from "../../common/Slider/Slider";
import { Widget } from "../common/Widget";

import styles from "./PumpModule.module.css"
import { refreshValueUpdate, useRefreshContext } from "../../common/other/RefreshProvider";
import { Pumps } from "../../apiMessages/pumps/_";
import { sendApiMessageSimple } from "../../apiMessages/apiMessageSimple";
import { isNumber } from "chart.js/helpers";
import { Icon } from "../../common/Icon/Icon";


interface PumpModuleBodyProps {
    module : Module
}

export function PumpModuleBody(props : PumpModuleBodyProps){
    const [ pumpCount , setPumpCount ] = createSignal<number | undefined>();
    const [ pumpCountErr , setPumpCountErr ] = createSignal<boolean>(false);
    const refreshCntx = useRefreshContext();

    const pumpArr = [1,2,3,4];

    let lastUpdate = 0;
    
    createEffect(async () => {
        if(!refreshValueUpdate(refreshCntx?.listen(),{length: 15000,lastUpdate: lastUpdate})){
            return
        }
        lastUpdate=Date.now();

        let result = await sendApiMessageSimple({
            url: Pumps.getPumpUrl(props.module.instance,undefined,"pump_count"),
            key:"pump_count"
        })
        if(isNumber(result)){
            setPumpCount(result);
        }
    })

    return (
        <div class={styles.container}>
            <For each={pumpArr}>
                {(el,index)=>(
                    <div classList={{
                        [styles.slider_container]:true,
                        [styles.disabled]:index() >= (pumpCount() ?? 0)
                    }}>
                        <SliderApiControl
                            class={styles.slider}
                            direction="V"
                            title={"Pump " + el}
                            
                            bounds={{min: -1, max: 1, show: true}}
                            step={0.05}
                            decimals={2}
                            
                            target={{
                                getter:{url:Pumps.getPumpUrl(props.module.instance,el,"speed"),key:"speed"},
                                setter:{url:Pumps.getPumpUrl(props.module.instance,el,"speed"),key:"speed"}
                            }}
                        ></SliderApiControl>
                        <div class={styles.not_installed_container}>
                            <Icon 
                                class={styles.icon}
                                name="devices_off"
                            ></Icon>
                            <p>not</p>
                            <p>installed</p>
                        </div>
                    </div>
                )}
            </For>
        </div>
    )
}

export interface PumpModuleProps extends PumpModuleBodyProps{
    id : string,
}

export function PumpModule(props : PumpModuleProps){
    return (
        <GridElement id={props.id} w={1} h={3}>
            <Widget 
                name="PumpModule"
                module={props.module}
            >
                <PumpModuleBody
                    {...props}
                ></PumpModuleBody>
            </Widget>
        </GridElement>
    )
}