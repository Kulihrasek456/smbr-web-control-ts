import { For, onMount } from "solid-js";
import styles from "./Debug.module.css"
import { moduleInstances, moduleTypes, useModuleListValue, type Module, type moduleInstancesType, type moduleTypesType } from "../other/ModuleListProvider";
import { createServerCookie } from "@solid-primitives/cookies";
import { isArray, isObject } from "../other/utils";

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