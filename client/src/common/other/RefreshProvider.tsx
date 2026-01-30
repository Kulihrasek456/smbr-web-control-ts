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
  
  if(props.autoRefreshPeriod){
    onMount(() => {
      softRefresh()
  
      let id = setInterval(softRefresh,props.autoRefreshPeriod)

      onCleanup(() => clearInterval(id));
    })
  }

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