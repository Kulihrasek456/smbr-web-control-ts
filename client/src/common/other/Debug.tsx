import { For } from "solid-js";
import styles from "./Debug.module.css"
import { moduleInstances, moduleTypes, useModuleListValue, type Module, type moduleInstancesType, type moduleTypesType } from "./ModuleListProvider";

interface DebugModuleEditorProps{
    class?: string;
}

export function DebugModuleEditor(props : DebugModuleEditorProps){
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
        }
    }

    return (
        <div class={styles.module_editor + " " + styles.container + " " + props.class}>
            <p>Loaded modules:</p>
            <For each={moduleListCntx.state()}>
                {(module, index) => (
                    <div class={styles.module}>
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