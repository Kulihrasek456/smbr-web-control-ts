import { For, onMount } from "solid-js";
import styles from "./Debug.module.css"
import { moduleInstances, moduleTypes, useModuleListValue, type Module, type moduleInstancesType, type moduleTypesType } from "../other/ModuleListProvider";
import { createServerCookie } from "@solid-primitives/cookies";
import { isArray, isObject } from "../other/utils";
import { smbr_apiMessageConfig } from "../../apiMessages/apiMessageConfig";

interface DebugModuleEditorProps{
    class?: string;
}

export function DebugModuleEditor(props : DebugModuleEditorProps){
    const [cookie, setCookie] = createServerCookie("SMBR-moduleList");
    const moduleListCntx = useModuleListValue();
    if(!moduleListCntx){
        return (
            <p style={{"white-space":"wrap"}}>Cannot init without module list context</p>
        )
    }

    function changeModule(module: Module, index: number){
        if(moduleListCntx){
            let newList = [...moduleListCntx.state()];
            newList[index] = module;
            moduleListCntx.actions.setModuleList(newList);
            setCookie(JSON.stringify(newList));
        }
    }

    onMount(()=>{
        let cookieData = cookie();
        if(cookieData){
            if(moduleListCntx){
                console.log(cookieData)
                let parsedCookie = JSON.parse(cookieData)
                if(!isArray(parsedCookie)){
                    return
                }
                for(let module of parsedCookie as any[]){
                    if(!isObject(module)){
                        return
                    }
                }
                moduleListCntx.actions.setModuleList(parsedCookie)
            }
        }
    })

    function removeModule(index: number){
        if(moduleListCntx){
            let newList : Module[] =[...moduleListCntx.state()];
            newList.splice(index,1);
            moduleListCntx.actions.setModuleList(
                newList
            )
        }
    }

    return (
        <div class={styles.module_editor + " " + styles.container + " " + props.class}>
            <p>Loaded modules:</p>
            <For each={moduleListCntx.state()}>
                {(module, index) => (
                    <div class={styles.module}>
                        <div>
                            <div class={styles.input_line}>
                                <p>Type: </p>
                                <select value={module.type} onChange={(e)=>{
                                    let selectedValue = e.currentTarget.value
                                    let newModule : Module = {instance: module.instance,type: selectedValue as moduleTypesType};
                                    changeModule(newModule,index());
                                }}>
                                    <For each={moduleTypes}>
                                        {(type) => (
                                            <option value={type}>{type}</option>
                                        )}
                                    </For>
                                </select>
                            </div>
                            <div class={styles.input_line}>
                                <p>Instance: </p>
                                <select value={module.instance} onChange={(e)=>{
                                    let selectedValue = e.currentTarget.value
                                    let newModule : Module = {instance: selectedValue as moduleInstancesType,type:module.type};
                                    changeModule(newModule,index());
                                }}>
                                    <For each={moduleInstances}>
                                        {(instance) => (
                                            <option value={instance}>{instance}</option>
                                        )}
                                    </For>
                                </select>
                            </div>
                        </div>
                        <button onclick={()=>removeModule(index())}>
                            X
                        </button>
                    </div>
                )}
            </For>
            <button onclick={e => {
                let newList : Module[] =[...moduleListCntx.state(),{type:"undefined",instance:"Undefined"}];
                moduleListCntx.actions.setModuleList(
                    newList
                )
            }}>Add module</button>
        </div>
    )
}

interface DebugApiMessageHostnameEditor{
    class?: string;
}
export function DebugApiMessageHostnameEditor(props :DebugApiMessageHostnameEditor){
    const [cookie, setCookie] = createServerCookie("SMBR-defaultHostname");
    let inputEl !: HTMLInputElement

    function setHostname(value : string){
        if(value!=""){
            console.log("changing hostname to: ",value);
            smbr_apiMessageConfig.defaultHostname = value
        }else{
            console.log("changing hostname back to default");
            smbr_apiMessageConfig.defaultHostname = window.location.hostname
        }
    }

    onMount(()=>{
        let cookieData = cookie()
        if(cookieData){
            console.log(cookieData)
            setHostname(cookieData)
        }
    })

    return (
        <div class={styles.container + " " + props.class}>
            <p>Api message target:</p>
            <div class={styles.horflex}>
                <input class={styles.grow}  ref={inputEl}></input>
                <button onclick={()=>{
                    if(inputEl){
                        setHostname(inputEl.value);
                        setCookie(inputEl.value);
                        inputEl.value = ""
                    }
                }}>set</button>
            </div>
        </div>
    )
}


interface DebugRefreshProviderIntervalProps{
    class?: string;
    interval:{
        getter: () => number;
        setter: (value: number) => void;
    }
    disabled:{
        getter: () => boolean;
        setter: (value: boolean) => void;
    }
}
export function DebugRefreshProviderInterval(props: DebugRefreshProviderIntervalProps){
    const [intervalCookie, setIntervalCookie] = createServerCookie("SMBR-updateInterval");
    const [disabledCookie, setDisabledCookie] = createServerCookie("SMBR-updateDisabled");
    let inputEl !: HTMLInputElement

    function setDisabled(value : boolean, save:boolean){
        console.log("changing refresh provider disabled to: ",value);
        props.disabled.setter(value)
        if(save){
            setDisabledCookie((value)?"true":"false");
        }
    }
    function setInterval(value : number, save:boolean){
        console.log("changing refresh provider interval to: ",value);
        props.interval.setter(value)
        if(save){
            setIntervalCookie(value.toString());
        }
    }

    onMount(()=>{
        let cookieDataInt = intervalCookie()
        let cookieDataDis = disabledCookie()
        if(cookieDataInt){
            console.log(cookieDataInt)
            if(Number(cookieDataInt)){
                setInterval(Number(cookieDataInt),false);
            }
        }
        if(cookieDataDis){
            console.log(cookieDataDis)
            if(cookieDataDis=="true"){
                setDisabled(true,false);
            }
            if(cookieDataDis=="false"){
                setDisabled(false,false);
            }
        }
    })

    return (
        <div class={styles.container + " " + props.class}>
            <p>Api message target:</p>
            <div class={styles.horflex}>
                <p>Do updates: </p>
                <input checked={!props.disabled.getter()} type="checkbox" onchange={e => setDisabled(!e.currentTarget.checked,true)}></input>
            </div>
            <div class={styles.horflex}>
                <input 
                    class={styles.grow} 
                    placeholder={props.interval.getter().toString()}
                    ref={inputEl}
                ></input>
                <button onclick={()=>{
                    if(inputEl){
                        if(Number(inputEl.value)){
                            setInterval(Number(inputEl.value),true);
                            inputEl.value = ""
                        }
                    }
                }}>set</button>
            </div>
        </div>
    )
}