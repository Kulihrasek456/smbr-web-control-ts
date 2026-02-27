import { createEffect, createSignal, For } from "solid-js";
import { Button } from "../../common/Button/Button";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { Icon } from "../../common/Icon/Icon";
import { Widget } from "../common/Widget";

import styles from "./QuickLaunch.module.css"
import { RefreshProvider, refreshValueUpdate, useRefreshValue } from "../../common/other/RefreshProvider";
import { Recipes } from "../../apiMessages/recipes/_";
import { Scheduler } from "../../apiMessages/scheduler/_";
import { sleep } from "../../common/other/utils";

interface QuickLaunchProps{
    id: string;
}

function parseMacroName(fileName : string){
    return fileName.substring(7).replaceAll("|","/");
}

function QuickLaunchBody(props: QuickLaunchProps){
    const [scripts, setScripts] = createSignal<string[]>([
        "macros|A",
        "macros|Maximum_Effort_Longname_Testing",
        "macros|Standard_User",
        "macros|Bo",
        "macros|Supercalifragilistic_Extra_Long",
        "macros|Omega_System",
        "macros|J",
        "macros|Ultra_Wide_Column_Width_Test_Case",
        "macros|Sigma_Data",
        "macros|Li",
        "macros|Winter_Season_Identifier_2026",
        "macros|Cy",
        "macros|Horizontal_Scroll_Enabler_String",
        "macros|Maintenance_Fixer",
        "macros|K",
        "macros|Longest_Possible_Name_Buffer_X1",
        "macros|Ocean_Wave",
        "macros|Xi",
        "macros|Database_Stress_Tester_Instance",
        "macros|Dry_Desert",
        "macros|V",
        "macros|String_Padding_Required_Check",
        "macros|Apple_Green",
        "macros|Zo",
        "macros|Overflow_Prevention_Unit_Alpha",
        "macros|Music_Beat",
        "macros|I",
        "macros|Robust_Input_Validator_Method",
        "macros|Toadstool",
        "macros|Ox",
        "macros|End_Of_The_Line_Final_Record_Z"
    ]);

    
    const [searchText, setSearchText] = createSignal<string>("");

    const  [scheduledScript, setScheduledScript] = createSignal<string>("---");
    const  [scriptState, setScriptState] = createSignal<string>("---");

    const refreshCntxt = useRefreshValue;

    async function refreshFileList(){
        let response = await Recipes.sendGetFileList({reloadFromFileSystem:false});
        let filtered = response.recipes.filter((value:string)=>{return value.substring(0,7) === "macros|"})
        
        setScripts(filtered);
    }

    async function refreshSelected(){
        let response = await Scheduler.sendRuntimeInfo();
        setScriptState(response.state);
        setScheduledScript(response.name);
    }



    async function refreshAll(delayed: boolean){
        if(delayed){
            await sleep(1000);
        }
        await Promise.all([
            refreshFileList(),
            refreshSelected()
        ])
    }

    async function stop(){
        await Scheduler.sendStopScheduled();
        await refreshAll(true);
        return true;
    }


    async function start(){
        await Scheduler.sendStartScheduled();
        await refreshAll(true);
        return true;
    }

    async function selectScript(fileName : string){
        await Scheduler.sendSetScheduled({fileName: fileName});
        await refreshAll(true);
        return true;
    }

    createEffect(async ()=>{
        if(!refreshValueUpdate(refreshCntxt())){
            return
        }

        await refreshAll(false);      
    })

    return (
        <Widget 
                name="Quick launch"
                hotbarTargets={()=>(
                    <>
                        <Button 
                            callback={start}
                            tooltip="Start the currently selected script"
                        >
                            <Icon name="play_arrow"></Icon>
                        </Button>
                        <Button 
                            callback={stop}
                            tooltip="Pause the currently selected script"
                        >
                            <Icon name="pause"></Icon>
                        </Button>
                    </>
                )}
                customRefreshProvider={true}
            >
            <div class={styles.selected_script}>
                <b>Selected script</b>
                <p>{scheduledScript()}</p>
            </div>
            <div class={styles.current_state}>
                <b>Current state</b>
                <p>{scriptState()}</p>
            </div>
            <div class={styles.macros_gallery_header}>
                <b>Macros gallery</b>
                <p>(includes files saved in macros folder) </p>
            </div>
            <div class={styles.macros_gallery_container}>
                <input 
                    type="text" 
                    class="button" 
                    placeholder="start typing to search..."
                    oninput={e => setSearchText("macros|"+e.currentTarget.value)}
                ></input>
                <div class={styles.macros_gallery_body}>
                    <For each={scripts()}>
                        {(script, index)=>(
                            <button 
                                classList={{
                                    ["button"]:true,
                                    [styles.macro]: true,
                                    [styles.active]: script === scheduledScript(),
                                    [styles.hidden]: searchText() !== "" && !script.includes(searchText())
                                }}
                                onclick={()=>selectScript(script)}
                            >
                                <p>{parseMacroName(script)}</p>
                            </button>
                        )}
                    </For>
                </div>
            </div>
        </Widget>
    )
}

export function QuickLaunch(props : QuickLaunchProps){
    return(
        <GridElement id={props.id} w={1} h={5}>
            <RefreshProvider>
                <QuickLaunchBody {...props}></QuickLaunchBody>
            </RefreshProvider>
        </GridElement>
    )
}