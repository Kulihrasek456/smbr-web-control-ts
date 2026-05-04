import { createEffect, createSignal, For, Show } from "solid-js"
import { GridElement } from "../../common/GridstackGrid/GridstackGrid"
import { Widget } from "../common/Widget"
import styles from "./Issues.module.css"
import { System } from "../../apiMessages/system/_";
import { refreshValueUpdate, useRefreshContext } from "../../common/other/RefreshProvider";
import { ValueDisplay } from "../../common/ApiFetcher/ValueDisplay";
import { TableStatic } from "../../common/Table/Table";
import { moduleInstanceColors } from "../../common/other/ModuleListProvider";


function renderRow(el : System.issueType, index : number){
    return [
        <p>{el.timestamp}</p>,
        <p>{el.name}</p>,
        <p>{el.index}</p>,
        <p>{el.value.toFixed(2)}</p>,
        <p>{el.module}</p>,
        <p>{el.instance}</p>,
        <p>{el.id}</p>
    ]
}


interface ModuleIssuesProps {
    id: string
}

function ModuleIssuesBody(props : ModuleIssuesProps){
    const [issues , setIssues] = createSignal<System.issueType[] | undefined>(undefined)
    const [errorsOccured, setErrorsOccured] = createSignal<boolean>(false);

    const refreshCntxt = useRefreshContext();

    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntxt?.listen())){
            return
        }

        try {
            let response = await System.sendIssues();

            setIssues(response.issues);
            setErrorsOccured(false);
        } catch (error) {
            setErrorsOccured(true);
            setIssues(undefined);
            throw error;
        }
    })


    return (
        <>
            <div class={styles.issue_count}>
                <p>Currently active issues:</p>
                <ValueDisplay value={issues()?.length.toString()} error={errorsOccured()}></ValueDisplay>
            </div>
            <div class={styles.issue_list_container}>
                <div class={styles.issue_list}>
                    <For each={issues() ?? []}>
                        {(el,index)=>(
                            <div class={styles.issue} style={{"--instance-color":moduleInstanceColors[el.instance]}}>
                                <div class={styles.basic_info}>
                                    <div class={styles.basic_info}>
                                        <div class={styles.labeled_value}>
                                        <p>module:</p>
                                        <p class={styles.module_name}>{el.module} ({el.instance})</p>
                                        </div>
                                        <div class={styles.labeled_value}>
                                            <p>Index:</p>
                                            <p>{el.index.toFixed(0)}</p>
                                        </div>
                                    </div>
                                    
                                    <ValueDisplay class={styles.time} value={el.timestamp.split("T")[1]}></ValueDisplay>
                                </div>
                                <div class={styles.values}>
                                    <p class={styles.id}>{el.id}</p>
                                    <p class={styles.name}>{el.name}</p>
                                    <div class={styles.labeled_value}>
                                        <p>Value:</p>
                                        <ValueDisplay value={el.value.toFixed(2)}></ValueDisplay>
                                    </div>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </>
    )
}

export function ModuleIssues(props: ModuleIssuesProps){
    
    return (
        <GridElement id={props.id} w={1} h={4}>
            <Widget name="Module issues">
                <ModuleIssuesBody {...props}></ModuleIssuesBody>
            </Widget>
        </GridElement>
    )
}