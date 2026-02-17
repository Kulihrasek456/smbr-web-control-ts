import { createContext, useContext, createSignal, createEffect, onMount, onCleanup } from "solid-js";

export interface RefreshPayload {
  forced: boolean;
  _ts: number;
}

const RefreshContext = createContext<(payload: RefreshPayload) => void>();
const RefreshValueContext = createContext<() => RefreshPayload>();

interface RefreshProviderProps{ 
  children: any, 
  autoRefreshPeriod?: number,
  disabled?: boolean
}
  let mountCount = 0;


export function RefreshProvider(props: RefreshProviderProps) {
  const [lastRefresh, setLastRefresh] = createSignal<RefreshPayload>({
    forced: false,
    _ts: 0,
  });

  const parentValue = useContext(RefreshValueContext);

  createEffect(() => {
    const pVal = parentValue?.();
    if (pVal && pVal._ts > 0) {
      setLastRefresh(pVal);
    }
  });

  const trigger = (payload: RefreshPayload) => {
    if(payload.forced){
      console.log("forcefully refreshing...");
    }
    if(!props.disabled){
      setLastRefresh(payload);
    }
  };

  const softRefresh = () => {
    if(!props.disabled){
      setLastRefresh({_ts:Date.now(),forced:false});
    }
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
      console.warn("doing initial refresh because: ",props.disabled);
      if(props.autoRefreshPeriod){
        softRefresh()

        startInterval(props.autoRefreshPeriod)
      }
    }
  })

  onCleanup(() => stopInterval());

  createEffect(()=>{
    if(!props.disabled && props.autoRefreshPeriod){
      softRefresh()
      startInterval(props.autoRefreshPeriod)
    }else{
      stopInterval()
    }
  })



  return (
    <RefreshContext.Provider value={trigger}>
      <RefreshValueContext.Provider value={lastRefresh}>
        {props.children}
      </RefreshValueContext.Provider>
    </RefreshContext.Provider>
  );
}
// for signaling a refresh, use: () => trigger({ forced: true, refetchConfigs: true, _ts: Date.now() })
export const useRefreshTrigger = () => useContext(RefreshContext);

// for only subscribing to changes, use this context as normal
export const useRefreshValue = () => useContext(RefreshValueContext);

export function refreshValueUpdate(refreshCntxt : (() => RefreshPayload) | undefined , minInterval ?: { length : number, lastUpdate : number}): boolean {
    let val = refreshCntxt?.();
    if (val) {
        if(val._ts != 0){
            if(val.forced){
                return true;
            }
            if(minInterval){
                if(Date.now() - minInterval.lastUpdate > minInterval.length){
                    return true
                }
            }else{
                return true;
            }
        }
    }
    
    return false;
}