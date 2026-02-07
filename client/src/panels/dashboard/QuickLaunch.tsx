import { createSignal, For } from "solid-js";
import { Button } from "../../common/Button/Button";
import { GridElement } from "../../common/GridstackGrid/GridstackGrid";
import { Icon } from "../../common/Icon/Icon";
import { Widget } from "../common/Widget";

import styles from "./QuickLaunch.module.css"

interface QuickLaunchProps{
    id: string;
}

export function QuickLaunch(props: QuickLaunchProps){
    const [scripts, setScripts] = createSignal<string[]>([
        "A",
        "Maximum_Effort_Longname_Testing",
        "Standard_User",
        "Bo",
        "Supercalifragilistic_Extra_Long",
        "Omega_System",
        "J",
        "Ultra_Wide_Column_Width_Test_Case",
        "Sigma_Data",
        "Li",
        "Winter_Season_Identifier_2026",
        "Cy",
        "Horizontal_Scroll_Enabler_String",
        "Maintenance_Fixer",
        "K",
        "Longest_Possible_Name_Buffer_X1",
        "Ocean_Wave",
        "Xi",
        "Database_Stress_Tester_Instance",
        "Dry_Desert",
        "V",
        "String_Padding_Required_Check",
        "Apple_Green",
        "Zo",
        "Overflow_Prevention_Unit_Alpha",
        "Music_Beat",
        "I",
        "Robust_Input_Validator_Method",
        "Toadstool",
        "Ox",
        "End_Of_The_Line_Final_Record_Z"
    ]);

    
    const [searchText, setSearchText] = createSignal<string>("");
    const [activeIndex, setActiveIndex] = createSignal<number>(0);

    return (
        <GridElement id={props.id} w={1} h={5}>
            <Widget 
                name="Quick launch"
                hotbarTargets={()=>(
                    <>
                        <Button>
                            <Icon name="play_arrow"></Icon>
                        </Button>
                        <Button>
                            <Icon name="stop"></Icon>
                        </Button>
                        <Button>
                            <Icon name="pause"></Icon>
                        </Button>
                    </>
                )}
            >
                <div class={styles.selected_script}>
                    <b>Selected script</b>
                    <p>---</p>
                </div>
                <div class={styles.current_state}>
                    <b>Current state</b>
                    <p>---</p>
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
                        oninput={e => setSearchText(e.currentTarget.value)}
                    ></input>
                    <div class={styles.macros_gallery_body}>
                        <For each={scripts()}>
                            {(script, index)=>(
                                <button 
                                    classList={{
                                        ["button"]:true,
                                        [styles.macro]: true,
                                        [styles.active]: index() === activeIndex(),
                                        [styles.hidden]: searchText() !== "" && !script.includes(searchText())
                                    }}
                                    onclick={()=>setActiveIndex(index())}
                                >
                                    <p>{script}</p>
                                </button>
                            )}
                        </For>
                    </div>
                </div>
            </Widget>
        </GridElement>
    )
}