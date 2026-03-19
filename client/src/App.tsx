import { createSignal, For, Show, type Accessor, type JSXElement } from 'solid-js'
import './common/css/colors.css'
import './common/css/global.css'
import styles from './App.module.css'

import { Icon } from './common/Icon/Icon'
import { Public } from './assets/PublicFiles'

import { Dashboard } from './panels/dashboard/Dashboard'
import { Scripts } from './panels/scripts/Scripts'
import { Config } from './panels/config/Config'
import { Device } from './panels/device/Device'
import { Hotbar } from './panels/hotbar/Hotbar'
import { RefreshProvider } from './common/other/RefreshProvider'
import { isDebug } from './common/debug/debugFlag'
import { DebugApiMessageHostnameEditor, DebugModuleEditor, DebugRefreshProviderInterval } from './common/debug/Debug'
import { ModuleListProvider, ModuleListRefresher } from './common/other/ModuleListProvider'
import { AutoScrollerP } from './common/AutoScroller/AutoScroller'

type ItemProps = { text: string; iconName: string, active: Accessor<string>, onClick?: ()=>void};

function Item({ text, iconName,onClick,active}: ItemProps) {
   return (
      <li>
         <button class={`${styles.item} ${(active() === text)?styles.active:''}`} onClick={onClick}>
            <div class={styles.icon}>
               <Icon name={iconName}/>
            </div>
            <div class={styles.text}>
               <p>{text}</p>
            </div>
         </button>
      </li>
   )
}


interface PanelProps{
    children : JSXElement,
    active : boolean
}

function Panel(props: PanelProps) {
   return (
      <div classList={{
         [styles.hidden]: !props.active,
         [styles.container]: true
      }}>
         <RefreshProvider disabled={!props.active}>
            {props.children}
         </RefreshProvider>
      </div>
   )
}

interface PanelsProps{
   items : {
      text: string, 
      iconName: string, 
      component: ()=>JSXElement
   }[],
   activeItem : string
}

function Panels(props: PanelsProps){
   return (
      <div class={styles.content}>
         <For each={props.items}>
            {(item)=>(
               <Panel active={item.text===props.activeItem}>
                  {item.component()}
               </Panel>
            )}
         </For>
                  
      </div>
   )
}


function App() {
   const [activeItem, setActiveItem] = createSignal("Dashboard");
   
   const [updateDisabled, setUpdateDisabled] = createSignal(isDebug);
   const [updateInterval, setUpdateInterval] = createSignal(5000);


   const [moduleListDisabled, setModuleListDisabled] = createSignal(isDebug);
   const [moduleListUpdateInterval, setModuleListUpdateInterval] = createSignal(15000);

   console.debug("update")

  const items : {text: string, iconName: string, component: ()=>JSXElement}[] = [
      { text: "Dashboard", iconName: "home", component: Dashboard },
      { text: "Scripts", iconName: "science", component: Scripts },
      { text: "Config", iconName: "build", component: Config },
      { text: "Device", iconName: "terminal", component: Device },
   ];
   return (
      <>
         <ModuleListProvider>
            <RefreshProvider disabled={updateDisabled()} autoRefreshPeriod={updateInterval()}>
               <header class={styles.hotbar}>
                  <button class={styles.logo}><img src={Public.images.minilogo} /></button>
                  <AutoScrollerP
                     class={styles.title}
                     value='Smart Modular Photo Bioreactor'
                  ></AutoScrollerP>
                  <div class={styles.hotbar_right}>
                     <Hotbar></Hotbar>
                  </div>
               </header>
               <div class={styles.main}>
                  <ul class={styles.sidebar}>
                     {items.map(item => (
                        <Item
                           text={item.text}
                           iconName={item.iconName}
                           active={activeItem}
                           onClick={() => setActiveItem(item.text)}
                        />
                     ))}
                     <Show when={isDebug}>
                        <div class={styles.debug}>
                           <button onclick={e=>e.currentTarget.parentElement?.classList.toggle(styles.collapsed)}>Debug mode</button>
                           <DebugModuleEditor></DebugModuleEditor>
                           <DebugApiMessageHostnameEditor></DebugApiMessageHostnameEditor>
                           <DebugRefreshProviderInterval
                              title="api refresh"
                              interval={{
                                 getter: updateInterval,
                                 setter: setUpdateInterval
                              }}
                              disabled={{
                                 getter: updateDisabled,
                                 setter: setUpdateDisabled
                              }}
                           ></DebugRefreshProviderInterval>
                            <DebugRefreshProviderInterval
                              title="module list refresh"
                              interval={{
                                 getter: moduleListUpdateInterval,
                                 setter: setModuleListUpdateInterval
                              }}
                              disabled={{
                                 getter: moduleListDisabled,
                                 setter: setModuleListDisabled
                              }}
                           ></DebugRefreshProviderInterval>
                        </div>
                     </Show>
                  </ul>
                  <Panels 
                     items={items}
                     activeItem={activeItem()}
                  ></Panels>
               </div>
            </RefreshProvider>
            <RefreshProvider autoRefreshPeriod={moduleListUpdateInterval()}>
               <ModuleListRefresher
                  enabled={!moduleListDisabled()}
                  min_interval={100}
               ></ModuleListRefresher>
            </RefreshProvider>
         </ModuleListProvider>
      </>
   )
}

export default App
