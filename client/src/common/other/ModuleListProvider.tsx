import { createContext, useContext, createSignal, createEffect, onMount, onCleanup } from "solid-js";

export const moduleTypes = [
  "core",
  "sensor",
  "pump",
  "control",
  "undefined"
] as const;

export const moduleInstances  = [
  "Undefined",
  "Exclusive",
  "All",
  "Reserved",
  "Instance_1",
  "Instance_2",
  "Instance_3",
  "Instance_4",
  "Instance_5",
  "Instance_6",
  "Instance_7",
  "Instance_8",
  "Instance_9",
  "Instance_10",
  "Instance_11",
  "Instance_12"
] as const;

export type moduleTypesType = typeof moduleTypes[number]
export type moduleInstancesType = typeof moduleInstances[number]

export type Module = {
  readonly type: moduleTypesType;
  readonly instance: moduleInstancesType;
}

export type ThemeContextValue = {
  state: () => Module[],
  actions: {
    setModuleList: (newList: Module[]) => void;
  }
};

interface ModuleListProviderProps{
  children: any;
}
const ModuleListContext = createContext<ThemeContextValue>();

export function ModuleListProvider(props : ModuleListProviderProps){
  const [moduleList, setModuleList] = createSignal<Module[]>([])

  createEffect(() => {
    console.log("module list changed to: ",moduleList());
  })

  return (
    <ModuleListContext.Provider value={{
      state: moduleList,
      actions:{
        "setModuleList": setModuleList
      }
    }}>
      {props.children}
    </ModuleListContext.Provider>
  )
}

export const useModuleListValue = () => useContext(ModuleListContext);