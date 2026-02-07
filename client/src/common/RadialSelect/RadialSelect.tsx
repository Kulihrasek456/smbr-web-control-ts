import { createUniqueId, For } from "solid-js";
import styles from "./RadialSelect.module.css"

interface RadialOptionProps{
    groupName : string;
    value: string;
    label: string;
    checked?:boolean;
    class?:string;
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
}

export function RadialSelect(props : RadialSelectProps){
    return(
        <div class={styles.container}>
            <For each={props.selections}>
                {(selection, index) => (
                    <RadialOption
                        groupName={props.groupName}
                        value={selection.value}
                        label={selection.label}
                        checked={index() == (props.defaultSelectedIndex ?? 0)}
                    ></RadialOption>
                )}
            </For>
        </div>
    )
}