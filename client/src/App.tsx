import { createSignal, type Accessor } from 'solid-js'
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


function App() {
   const [activeItem, setActiveItem] = createSignal("Dashboard");

   console.debug("update")

  const items = [
      { text: "Dashboard", iconName: "home", component: Dashboard },
      { text: "Scripts", iconName: "science", component: Scripts },
      { text: "Config", iconName: "build", component: Config },
      { text: "Device", iconName: "terminal", component: Device },
   ];
   return (
      <>
         <RefreshProvider disabled={true} autoRefreshPeriod={5000}>
            <header class={styles.hotbar}>
               <button class={styles.logo}><img src={Public.images.minilogo} /></button>
               <h1>Smart Modular Photo Bioreaktor</h1>
               <div class={styles.hotbar_left}>
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
               </ul>
               <div class={styles.content}>
                  {items.map(item => {
                     const ContentComponent = item.component;
                     return (
                        
                        <div class={(activeItem() !== item.text)?styles.hidden:""}>
                           <ContentComponent />
                        </div>
                     );
                  })}
               </div>
            </div>
         </RefreshProvider>
      </>
   )
}

export default App
