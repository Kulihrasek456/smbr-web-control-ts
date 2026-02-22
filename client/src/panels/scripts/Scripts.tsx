import { createSignal } from "solid-js";
import { TextEditor } from "../common/TextEditor/TextEditor"

export function Scripts(){
    return (
        <TextEditor 
            allowFileCreation={true}
            runtimeInfo={{}}
            targetEndpoint="/recipes"
            target="reactorApi"
        ></TextEditor>
    )
}