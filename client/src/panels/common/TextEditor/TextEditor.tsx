import { createSignal, For, Show, type JSXElement } from "solid-js";
import { CodeMirrorWrapper } from "./CodeMirrorWrapper";

import codeStyles from "./CodePart.module.css";
import fileListStyles from "./FileList.module.css";
import runtimeInfoStyles from "./RuntimeInfo.module.css";
import textEditorStyles from "./TextEditor.module.css"
import { Button } from "../../../common/Button/Button";
import { Icon } from "../../../common/Icon/Icon";
import { TableStatic } from "../../../common/Table/Table";

const testString =
  `# template file from: https://www.ibm.com/docs/en/cloud-paks/cloudpak-data-system/2.0.0?topic=configuration-template-sample-yaml
  all:
    children:
      control_nodes:
        hosts:
          node1:
            custom_hostname: <VALUE>
            management_network:
              network1:
                ip: <VALUE>
          node2:
            custom_hostname: <VALUE>
            management_network:
              network1:
                ip: <VALUE>
          node3:
            custom_hostname: <VALUE>
            management_network:
              network1:
                ip: <VALUE>
      switches:
      #BEGIN BGP
        vars:
          cp4d_asplain: <VALUE>
          cp4d_network: <VALUE>
          cp4d_network_vip: <VALUE>
        hosts:
          FabSw1a:
            ansible_host: localhost
            vrr_ip_addr: <VALUE>
            cp4d_routerID: 9.0.62.1
            isl_peer: 9.0.255.2
            bgp_links:
                link1:
                swp: <VALUE>
                neighbor: <VALUE>
                ip_addr: <VALUE>
                mtu: 9000
                link_speed: 10000
          FabSw1b:
            ansible_host: localhost
            vrr_ip_addr: <VALUE>
            cp4d_routerID: 9.0.62.2
            isl_peer: 9.0.255.1
            bgp_links:
              link1:
                swp: <VALUE>
                neighbor: <VALUE>
                ip_addr: <VALUE>
                mtu: 9000
                link_speed: 10000
      #END BGP

      #BEGIN L2
      switches:
        hosts:
          FabSw1a:
            ansible_host: localhost
            external_connection_config:
              external_link1:
                switch_ports: ['<VALUE>', '<VALUE>']
                port_config:
                  mtu: 9000
                  link_speed: 10000
                vlans: ['VALUE']
                strict_vlan: <VALUE>
                name: <VALUE>
                lacp_link: True
                lacp_rate: Fast
                clag_id: 100
                partner_switch: 'FabSw1b'
      #END L2

    vars:
      app_fqdn: <VALUE>
      #(pick from timedatectl list-timezones), default is EDT
      timezone: "<OPTIONAL>"
      #must begin with server or pool
      time_servers: ["<OPTIONAL>"]
      dns_servers: ["<VALUE>"]
      dns_search_strings: ["<OPTIONAL>"]
      smtp_servers: ["<OPTIONAL>"]
      management_network:
        network1:
          subnet: <VALUE>
          # just number, no slash 
          prefix: <VALUE>
          gateway: <VALUE>
          floating_ip: <VALUE>
          mtu: <OPTIONAL>
          custom_routes: <OPTIONAL>
      application_network_enabled: False
      openshift_networking_enabled: False
      policy_based_routing_enabled: True
      application_network:
        network1:
          default_gateway: true
          vlan: <VALUE>
          # just number, no slash 
          prefix: <VALUE>
          gateway: <VALUE>
          floating_ip: <VALUE>
          mtu: <OPTIONAL>
          custom_routes: <OPTIONAL>
          additional_openshift_ipaddrs: ["<OPTIONAL>"]
          additional_openshift_routes: ["<OPTIONAL>"]
  `


function CodePart() {
  const [code, setCode] = createSignal(testString);
  const [selected, setSelected] = createSignal("placeholder text");
  return (
    <div class={codeStyles.container} style={{ "flex": "1 1 auto", "min-width": 0, "min-height": 0 }}>
      <div class={codeStyles.header}>
        <Button>
          <Icon name="delete"></Icon>
        </Button>
        <h1 class={codeStyles["file-name"]}>
          {selected()}
        </h1>
        <Button>
          <Icon name="upload"></Icon>
        </Button>
        <Button>
          <Icon name="share_windows"></Icon>
        </Button>
      </div>
      <div class={codeStyles["code-editor"]}>
        <CodeMirrorWrapper onSave={() => { alert(code()) }} initialValue={testString} onChange={(code: string) => { setCode(code) }}></CodeMirrorWrapper>
      </div>
    </div>
  )
}

type fileOrDirectory = {
  name: string;
  children: fileOrDirectory[]
}

interface FileListProps {
  buttons?: ((index: number) => JSXElement)[],
  createFileButton?: {
    onClick: (fileName: string) => boolean
  },
  files: fileOrDirectory[]
}

function FileListElement(props: { data: fileOrDirectory }) {
  return (
    <Show when={props.data.children.length > 0} fallback={
      <li class={fileListStyles["file"]}>{props.data.name}</li>
    }>
      <ul class={fileListStyles["directory"]}>
        <div class={fileListStyles["directory-header"]}>
          <button class={fileListStyles["collapse-button"]}
            onclick={e => { e.currentTarget.parentElement?.parentElement?.classList.toggle(fileListStyles["collapsed"]) }}>
            <p class={fileListStyles["directory-name"]}>{props.data.name}</p>
            <div class={fileListStyles["collapse-arrow"]}>
              <Icon name="keyboard_arrow_down"></Icon>
            </div>
          </button>
          <button class={fileListStyles["create-file-specific-button"]}>
            <Icon name="add"></Icon>
          </button>
        </div>
        <For each={props.data.children}>
          {(child, index) => (
            <FileListElement data={child}></FileListElement>
          )}
        </For>
      </ul>
    </Show>
  )
}

function FileList(props: FileListProps) {
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
          <div class={fileListStyles["create-button-container"] + " " + fileListStyles["collapsed"]}>
            <div class={fileListStyles["create-button-inputs"]}>
              <input class={"button " + fileListStyles["create-button-text-input"]} placeholder="file name"></input>
              <button class={"button " + fileListStyles["create-button-button-input"]}>create</button>
            </div>
            <button class={fileListStyles["create-button-handle"]}
              onclick={e => { e.currentTarget.parentElement?.classList.toggle(fileListStyles["collapsed"]) }}>
              <Icon name="add_circle" filled={false}></Icon>
            </button>
          </div>
        </Show>
      </div>
      <div class={fileListStyles.list}>
        <For each={props.files}>
          {(file, index) => (
            <FileListElement data={file}></FileListElement>
          )}
        </For>
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
            <CodeMirrorWrapper initialValue="test" onChange={() => { }} onSave={() => { }}>
            </CodeMirrorWrapper>
          </OutputContainer>
        </div>
      </div>
    </div>
  )
}


export function TextEditor() {
  let runtimeInfo!: HTMLDivElement;

  return (
    <div style={{
      display: "flex",
      "min-width": 0,
      flex: "1 1 auto"
    }}>
      <FileList files={[
        {
          name: "test_head", children: [
            { name: "test_1", children: [] },
            { name: "test_2", children: [] },
            { name: "test_3", children: [] },
            { name: "test_4", children: [] },
            {
              name: "test_5", children: [{
                name: "test_head", children: [
                  { name: "test_1", children: [] },
                  { name: "test_2", children: [] },
                  { name: "test_3", children: [] },
                  { name: "test_4", children: [] },
                  { name: "test_5", children: [] }
                ]
              }]
            }
          ]
        },
        { name: "test_6", children: [] },
        { name: "test_7", children: [] },
        { name: "test_8", children: [] },
        { name: "test_9", children: [] }
      ]}></FileList>
      <FileList buttons={[() => (<p>test</p>)]} files={[]} createFileButton={{ onClick: val => { alert(val); return true; } }}></FileList>
      <CodePart></CodePart>
      <button class={textEditorStyles["runtime-info-handle"] + " button"} onclick={e=>{if(runtimeInfo){runtimeInfo.classList.toggle(textEditorStyles.collapsed)}}}>
        <div><Icon name="arrow_back_ios_new"></Icon></div>
        <p>Runtime info</p>
        <div><Icon name="arrow_back_ios_new"></Icon></div>
      </button>
      <div class={textEditorStyles["runtime-info"]} ref={runtimeInfo}>
        <RuntimeInfo></RuntimeInfo>
      </div>
    </div>
  )
}