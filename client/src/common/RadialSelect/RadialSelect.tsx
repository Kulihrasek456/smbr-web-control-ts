import { createUniqueId, For } from "solid-js";
import styles from "./RadialSelect.module.css"

interface RadialOptionProps{
    groupName : string;
    value: string;
    label: string;
    checked?:boolean;
    class?:string;
    onChange?: (value : string) => void;
}

export function RadialOption(props : RadialOptionProps) {
  const id = createUniqueId();

  return (
    <div class={props.class + " "+ styles.radial}>
      <input 
        type="radio" 
        id={id} 
        name={props.groupName} 
        value={props.value} 
        checked={props.checked}
        onChange={e => props.onChange?.(e.currentTarget.value)}
      />
      <label for={id}>{props.label}</label>
    </div>
  );
}

interface RadialSelectProps{
    groupName : string;
    selections: {
        value: string;
        label: string;
    }[];
    defaultSelectedIndex?:number;
    getter: ()=>string;
    setter: (value: string)=>void;
}

export function RadialSelect(props : RadialSelectProps){
    function updateSelection(value : string){
        props.setter(value);
    }
    return(
        <div class={styles.container}>
            <For each={props.selections}>
                {(selection, index) => (
                    <RadialOption
                        groupName={props.groupName}
                        value={selection.value}
                        label={selection.label}
                        checked={index() == (props.defaultSelectedIndex ?? 0) || props.getter() == selection.value}
                        onChange={updateSelection}
                    ></RadialOption>
                )}
            </For>
        </div>
    )
}