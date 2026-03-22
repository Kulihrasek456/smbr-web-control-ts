import { createContext, useContext, createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";

export var showDebugFrames = false;

type RefreshValue = {
  forced: boolean,
  timeStamp : number
}

type RefreshContextValue = {
  disabled: ()=>boolean,
  refresh: (forced : boolean) => void;
  listen: () => RefreshValue
}
const RefreshContext = createContext<RefreshContextValue>();

interface RefreshProviderProps{ 
  children: any, 
  autoRefreshPeriod?: number,
  disabled?: boolean
}

export function RefreshProvider(props: RefreshProviderProps) {
  const [disabled, setDisabled] = createSignal<boolean>(props.disabled??false);
  const [value, setValue] = createSignal<RefreshValue>({
    timeStamp: 0,
    forced: false
  });

  function doRefresh(forced : boolean){
    setValue({
      timeStamp: Date.now(),
      forced: forced
    })
  }

  const [lastRefresh, setLastRefresh] = createSignal<RefreshContextValue>({
    disabled: disabled,
    refresh: doRefresh,
    listen: value
  });

  function isDisabled(selfDisabled : boolean | undefined, parentDisabled : boolean){
    return (selfDisabled ?? false) || parentDisabled;
  }

  const parentContext = useContext(RefreshContext);

  createEffect(()=>{
    let parent = parentContext;
    if(parent !== undefined){
      setDisabled(isDisabled(props.disabled,parent.disabled()));
    }else{
      setDisabled(props.disabled??false);
    }
  })


  createEffect(()=>{
    let parent = parentContext;
    if(parent !== undefined){
      if(!isDisabled(props.disabled, disabled())){
        setValue(parent.listen());
      }
    }
  })

  function softRefresh(){
    doRefresh(false);
  }

  let intervalId : number | undefined = undefined;

  function stopInterval(){
    if(intervalId){
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  function startInterval(period : number){
    stopInterval()
    intervalId = setInterval(softRefresh,period)
  }

  onMount(() => {
    if(!props.disabled){
      if(props.autoRefreshPeriod){
        softRefresh()

        startInterval(props.autoRefreshPeriod)
      }
    }
  })

  onCleanup(() => stopInterval());

  createEffect(()=>{
    if(!isDisabled(props.disabled,disabled()) && props.autoRefreshPeriod){
      softRefresh()
      startInterval(props.autoRefreshPeriod)
    }else{
      stopInterval()
    }
  })



  return (
    <RefreshContext.Provider value={lastRefresh()}>
      <Show when={showDebugFrames}>
        <div style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          border: "1px solid",
          "border-color": (disabled())?"red":"green",
          "pointer-events": "none"
        }}>
          <p>{value().timeStamp}</p>
        </div>
      </Show>
        {props.children}
    </RefreshContext.Provider>
  );
}

export const useRefreshContext = () => useContext(RefreshContext);

export function refreshValueUpdate(refreshValue : RefreshValue | undefined, minInterval ?: { length : number, lastUpdate : number}): boolean {
  if(refreshValue){
    if(refreshValue.timeStamp != 0){
      if(refreshValue.forced){
        return true;
      }
  
      if(minInterval){
        if(Date.now() - minInterval.lastUpdate > minInterval.length){
          return true
        }
        return false;
      }else{
        return true;
      }
    }
  }
  return false;
}