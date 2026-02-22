import { createEffect, createSignal, For, Show, type JSXElement } from "solid-js";
import { CodeMirrorWrapper, type CodeMirrorWrapperProps } from "./CodeMirrorWrapper";

import codeStyles from "./CodePart.module.css";
import fileListStyles from "./FileList.module.css";
import runtimeInfoStyles from "./RuntimeInfo.module.css";
import textEditorStyles from "./TextEditor.module.css"
import { Button } from "../../../common/Button/Button";
import { Icon } from "../../../common/Icon/Icon";
import { TableStatic } from "../../../common/Table/Table";
import { RefreshProvider, refreshValueUpdate, useRefreshValue } from "../../../common/other/RefreshProvider";
import { targets, type targetsType } from "../../../apiMessages/apiMessageBase";
import { parseApiMessageFileList, sendApiMessageDeleteFile, sendApiMessageGetFileContent, sendApiMessageGetFileList, sendApiMessageSetFileContent, type apiMessageGetFileContentResult, type FileListDirectory } from "../../../apiMessages/apiMessageFileOperations";



interface FileListElementProps {
  data: FileListDirectory,
  maxDepth?: number,

  isRoot?: boolean,

  // the full previous path
  prefixPath?: string,

  // gets the currently selected file
  activeFileName : ()=>string | undefined

  // callback called when a file is selected
  onSelect: (fileName : string)=>void;
}

function FileListElement(props: FileListElementProps) {
  let isRoot=(props.isRoot ?? true);
  let self : HTMLUListElement | undefined;
  
  let prefixPath ="";
  if(props.prefixPath !== undefined && !isRoot){
    prefixPath = props.prefixPath + props.data.name + "|"
  }
  return (
    <ul 
      classList={{
        [fileListStyles["directory"]]:!isRoot,
        [fileListStyles["root"]]:isRoot,
        [fileListStyles["collapsed"]]:true
      }}
      ref={self}
    >
      <Show when={!isRoot}>
        <div class={fileListStyles["directory-header"]}>

          <button
            class={fileListStyles["collapse-button"]}
            onclick={e => { 
              self?.classList.toggle(fileListStyles["collapsed"]) 
            }}
          >
            <p class={fileListStyles["directory-name"]}>{props.data.name}</p>
            <div class={fileListStyles["collapse-arrow"]}>
              <Icon name="keyboard_arrow_down"></Icon>
            </div>
          </button>

          <button class={fileListStyles["create-file-specific-button"]}>
            <Icon name="add"></Icon>
          </button>

        </div>
      </Show>
      <Show when={(props.maxDepth ?? 1)>0}>
        <For each={Object.entries(props.data.subDirectories)}>
          {(directory, index) => (
            <FileListElement 
              maxDepth={(props.maxDepth)?(props.maxDepth-1):(undefined)} 
              data={directory[1]}
              isRoot={false}
              onSelect={props.onSelect}
              prefixPath={prefixPath}
              activeFileName={props.activeFileName}
            ></FileListElement>
          )}
        </For>
        <For each={props.data.files}>
          {(fileName, index) => (
            <li 
              classList={{
                [fileListStyles["file"]]:true,
                [fileListStyles["active"]]: (props.activeFileName() === prefixPath+fileName)
              }}
              onclick={()=>{props.onSelect(prefixPath+fileName)}}
            >{fileName}</li>
          )}
        </For>
      </Show>
    </ul>
  )
}

interface FileListProps {
  buttons?: ((index: number) => JSXElement)[],
  createFileButton?: {
    onClick: (fileName: string) => Promise<boolean>
  },
  files: FileListDirectory

  onSelect: (fileName : string) => void;
  activeFileName: ()=>string | undefined;
}

function FileList(props: FileListProps) {
  let newFileInput : HTMLInputElement | undefined;
  let newFileContainer : HTMLDivElement | undefined;
  return (
    <div class={fileListStyles.container} style={{ flex: "0 0 auto" }}>
      <div class={fileListStyles.search}>
        <input class={fileListStyles["search-field"]} placeholder="type in to search..."></input>
      </div>
      <div class={fileListStyles["button-panel"]}>
        <Show when={props.buttons}>
          <For each={props.buttons}>
            {(button, index) => (
              <div class={fileListStyles["panel-button"] + " button"}>
                {button(index())}
              </div>
            )}
          </For>
        </Show>
        <Show when={props.createFileButton}>
          <div 
            ref={newFileContainer}
            class={fileListStyles["create-button-container"] + " " + fileListStyles["collapsed"]}
          >
            <div class={fileListStyles["create-button-inputs"]}>
              <input 
                ref={newFileInput}
                class={"button " + fileListStyles["create-button-text-input"]} 
                placeholder="file name"
              ></input>
              <button 
                class={"button " + fileListStyles["create-button-button-input"]}
                onclick={async e => {
                  if(newFileInput){
                    if(await props.createFileButton?.onClick(newFileInput.value)){
                      newFileContainer?.classList.toggle(fileListStyles["collapsed"]) ;
                    }
                  }
                }}
              >create</button>
            </div>
            <button class={fileListStyles["create-button-handle"]}

              onclick={e => {
                newFileContainer?.classList.toggle(fileListStyles["collapsed"])
              }}>

              <Icon name="add_circle" filled={false}></Icon>
            </button>
          </div>
        </Show>
      </div>
      <div class={fileListStyles.list}>
        <FileListElement 
          data={props.files}
          onSelect={props.onSelect}
          activeFileName={props.activeFileName}
        ></FileListElement>
      </div>
    </div>
  )
}

interface RuntimeInfoProps {
  
}

function OutputContainer(props: { children?: JSXElement, title: string, info?: string, class?: string , style?: string}) {
  return (
    <div style={props.style} class={runtimeInfoStyles["output-container"] + " " + props.class}>
      <div class={runtimeInfoStyles["oc-header"]}>
        <h2 class={runtimeInfoStyles["oc-title"]}>{props.title}</h2>
        <p>{props.info}</p>
      </div>
      <div class={runtimeInfoStyles["oc-body"]}>
        {props.children}
      </div>
    </div>
  )
}

function TwoColTable(props: { data: { left: string, right: string }[], leftSize: string }) {
  return (
    <div class={runtimeInfoStyles["two-col-table"]}>
      <For each={props.data}>
        {(line, index) => (
          <div class={runtimeInfoStyles["tc-table-line"]}>
            <p style={"min-width: " + props.leftSize} class={runtimeInfoStyles["left"]}>{line.left}</p>
            <p class={runtimeInfoStyles["right"]}>{line.right}</p>
          </div>
        )}
      </For>
    </div>
  )
}

function statusImg(state : string){
  return "clock_loader_10";
}

function RuntimeInfo(props: RuntimeInfoProps) {
  const [selected, setSelected] = createSignal("placeholder text");
  const [status, setStatus] = createSignal("paused");
  const [callStack, setCallStack] = createSignal([
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" }
  ]);
  const [consoleOut, setConsoleOut] = createSignal([
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111da wd wad wad awd wadwad", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" },
    { left: "1", right: "test" },
    { left: "2", right: "test1" },
    { left: "111", right: "test4" },
    { left: "3", right: "test2" },
    { left: "45", right: "test3" }
  ]);
  const [scriptContent, setScriptContent] = createSignal("string");

  return (
    <div class={runtimeInfoStyles.container}>
      <div class={runtimeInfoStyles.header}>
        <h1>
          Runtime Info
        </h1>
        <Button class={runtimeInfoStyles["start-button"]}>
          <Icon name="play_arrow"></Icon>
        </Button>
        <Button class={runtimeInfoStyles["stop-button"]}>
          <Icon name="stop"></Icon>
        </Button>
        <Button class={runtimeInfoStyles["pause-button"]}>
          <Icon name="pause"></Icon>
        </Button>
      </div>
      <div class={runtimeInfoStyles.body}>
        <div class={runtimeInfoStyles.header2}>
          <div class={runtimeInfoStyles["selected-script"]}>
            <p>Selected script:</p>
            <h2 class={runtimeInfoStyles["selected-script-name"]}>{selected()}</h2>
          </div>
          <div class={runtimeInfoStyles["selected-id"]}>
            <p>Process id:</p>
            <h2 class={runtimeInfoStyles["selected-id-name"]}>{15235}</h2>
          </div>
        </div>
        <div class={runtimeInfoStyles.body2}>
          <div class={runtimeInfoStyles["info-panel"]}>
            <OutputContainer title="CALL STACK" class={runtimeInfoStyles["call-stack"]}>
              <TwoColTable data={callStack()} leftSize={"30px"}>

              </TwoColTable>
            </OutputContainer>
            <div class={runtimeInfoStyles["info-panel-stats"]}>
              <h2>Started: </h2>
              <p>25:66 15.8.2009</p>
              <h2>Time Elapsed: </h2>
              <p>---</p>
            </div>
            <div class={runtimeInfoStyles["status"]}>
              <h2>Status: {status()}</h2>
              <div class={runtimeInfoStyles["status-img"]}>

                <Icon name={statusImg(status())}></Icon>
              </div>
            </div>
          </div>
          <OutputContainer title="OUTPUT" class={runtimeInfoStyles["log-ouptut"]} info="9999 logs">
            <TwoColTable data={consoleOut()} leftSize={"50px"}>

            </TwoColTable>
          </OutputContainer>
          <OutputContainer class={runtimeInfoStyles["script-preview"]} title="SELECTED SCRIPT PREVIEW" info="read-only view">
            <CodeMirrorWrapper initialValueGetter={scriptContent} readOnly={true}>
            </CodeMirrorWrapper>
          </OutputContainer>
        </div>
      </div>
    </div>
  )
}


type File = {
  name: string,
  content: string
}

interface TextEditorProps {
  twoColFileList? : boolean;
  runtimeInfo? : RuntimeInfoProps;
  allowFileCreation? : boolean;

  targetEndpoint: string;
  target?: targetsType
}

export function TextEditor(props : TextEditorProps) {
  let runtimeInfo!: HTMLDivElement;
  const refreshCntxt = useRefreshValue;

  // this is the currently edited, local version of a file
  const [fileName,setFileName] = createSignal<string | undefined>();
  const [fileContent,setFileContent] = createSignal<string | undefined>();
  const [fileList, setFileList] = createSignal<FileListDirectory | undefined>();
  const [dirtyFlag, setDirtyFlag] = createSignal<boolean>(false);
  const [runtimeInfoPeriod, setRuntimeInfoPeriod] = createSignal<number | undefined>();

  // this is the currently edited, original version of a files content.
  const [downloadedScriptContent, setDownloadedScriptContent] = createSignal<string>("");
  
  async function loadFile(fileName : string) : Promise<boolean>{
    try {
      if(!dirtyFlag()){
        let result = await sendApiMessageGetFileContent({
          fileName: fileName,
          url: props.targetEndpoint,
          target: props.target
        }) 
  
        setDownloadedScriptContent(result.content);
        setFileName(fileName)
        setFileContent(result.content)
        return true;
      }
    } catch (error) {
      setFileName(undefined)
      setFileContent(undefined)
      throw error;
    }
    return false;
  }

  async function uploadToServer() : Promise<boolean>{
    let currFileName = fileName();
    let currFileContent = fileContent();
    if(currFileName !== undefined && currFileContent !== undefined){    
      if(dirtyFlag()){
        await sendApiMessageSetFileContent({
          fileName: currFileName,
          content: currFileContent,
          url: props.targetEndpoint,
          target: props.target
        });
  
        setDirtyFlag(false);
        return true;
      }
    }
    return false;
  }

  async function deleteFile() : Promise<boolean>{
    let currFileName = fileName();
    if(currFileName !== undefined){
      if(!dirtyFlag()){
        await sendApiMessageDeleteFile({
          fileName: currFileName,
          url: props.targetEndpoint,
          target: props.target
        })

        setDownloadedScriptContent(" ");
        setFileName(undefined);
        setFileContent(undefined);
        reloadFileList(true);
        return true;
      }
    }
    return false;
  }

  

  let lastFileList : string[] | undefined = undefined; 
  async function reloadFileList(reloadFromFileSystem: boolean){
    try {

      let response = await sendApiMessageGetFileList({
        url:props.targetEndpoint,
        target: props.target,
        reloadFromFileSystem: reloadFromFileSystem
      })

      if(lastFileList){
        if(response.recipes.length == lastFileList.length){
          let noChange = true;
          for(let i =0; i< lastFileList.length;i++){
            if(response.recipes[i] != lastFileList[i]){
              noChange = false;
              break;
            }
          }
          if(noChange){
            return;
          }
        }
      }
      lastFileList = response.recipes;
      setFileList(parseApiMessageFileList(response.recipes));

    } catch (error) {
      setFileList(undefined);
      throw error;
    }
  }

  async function createFile(fileName : string) : Promise<boolean>{
    let fileExists : boolean = false;
    try {
      await sendApiMessageGetFileContent({
        fileName: fileName,
        url: props.targetEndpoint,
        target: props.target
      })
      fileExists = true;
    } catch (error) {

    }

    if(fileExists){
      return false;
    }

    await sendApiMessageSetFileContent({
      fileName: fileName,
      content: "",
      url: props.targetEndpoint,
      target: props.target
    })

    reloadFileList(true);
    return true;
  }

  createEffect(async ()=>{
    if(refreshValueUpdate(refreshCntxt())){
      await reloadFileList(refreshCntxt()?.()?.forced ?? false);
    }
  })


  return (
    <div style={{
      display: "flex",
      "min-width": 0,
      flex: "1 1 auto"
    }}>
      <Show when={props.twoColFileList}>
        <FileList 
          files={fileList() ?? {name:"root",files:[],subDirectories:{}}}
          onSelect={(value:string)=>{}}
          activeFileName={()=>""}
        ></FileList>
      </Show>

      <FileList 
        buttons={[() => (
          <Button
            callback={async ()=>(await reloadFileList(true))}
          >reload from fileSystem</Button>
        )]} 
        files={
          fileList() ?? {name:"root",files:[],subDirectories:{}}
        } 
        createFileButton={{
          onClick: async val => (await createFile(val.replaceAll("/","|")))
        }}
        onSelect={(value:string)=>{
          loadFile(value);
        }}
        activeFileName={fileName}
      ></FileList>

      <div
        classList={{
          [codeStyles.container]: true,
          [codeStyles.unsaved]: dirtyFlag() ?? false
        }}
        style={{ "flex": "1 1 auto", "min-width": 0, "min-height": 0 }}
      >
        <div class={codeStyles.header}>

          <Button
            disabled={dirtyFlag() || fileName() === undefined}
            callback={deleteFile}
          >
            <Icon name="delete"></Icon>
          </Button>

          <h1 class={codeStyles["file-name"]}>
            {(fileName() ?? "No file loaded").replaceAll("|","/")}
          </h1>
          
          <Button
            disabled={(!dirtyFlag()) || fileName() === undefined}
            callback={uploadToServer}
          >
            <Icon name="upload"></Icon>
          </Button>

          <Button
            disabled={dirtyFlag() || fileName() === undefined}
          >
            <Icon name="share_windows"></Icon>
          </Button>
          
        </div>
        <div class={codeStyles["code-editor"]}>
          <CodeMirrorWrapper
            initialValueGetter={downloadedScriptContent}
            onChange={(value: string)=>{
              setFileContent(value);
              setDirtyFlag(true);
            }}
            readOnly={fileName() === undefined}
            onSave={uploadToServer}
          ></CodeMirrorWrapper>
        </div>
      </div>


      <Show when={props.runtimeInfo}>
        <button class={textEditorStyles["runtime-info-handle"] + " button"} onclick={e => { if (runtimeInfo) { runtimeInfo.classList.toggle(textEditorStyles.collapsed) } }}>
          <div><Icon name="arrow_back_ios_new"></Icon></div>
          <p>Runtime info</p>
          <div><Icon name="arrow_back_ios_new"></Icon></div>
        </button>
        <div class={textEditorStyles["runtime-info"]} ref={runtimeInfo}>
          <RefreshProvider autoRefreshPeriod={runtimeInfoPeriod()}>
            <RuntimeInfo></RuntimeInfo>
          </RefreshProvider>
        </div>
      </Show>
    </div>
  )
}