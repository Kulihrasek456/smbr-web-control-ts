import { TextEditor } from "../common/TextEditor/TextEditor"

export function Scripts(){
    return (
        <TextEditor initialValue="ahoj" onChange={() => {console.log("dwajh")}}></TextEditor>
    )
}