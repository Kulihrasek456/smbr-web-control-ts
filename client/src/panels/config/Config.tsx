import { TextEditor } from "../common/TextEditor/TextEditor";

export function Config(){
    return (
        <TextEditor 
            twoColFileList={true}
            targetEndpoint="/config-files"
            target="webControlApi"
            allowFileCreation={false}
            allowFileDeletion={false}
        ></TextEditor>
    )
}