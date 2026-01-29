import { For } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import styles from './Table.module.css'

interface TableProps {
  headers?: () =>  string[];
  data: () => JSX.Element[][];
}

export function Table(props: TableProps) {
  return (
    <table class={styles.table}>
      {props.headers && (
        <thead>
          <tr>
            <For each={props.headers()}>
              {(header) => <th>{header}</th>}
            </For>
          </tr>
        </thead>
      )}
      <tbody>
        <For each={props.data()}>
          {(row) => (
            <tr>
              <For each={row}>{(cell) => <td>{cell}</td>}</For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}


interface TableGridProps {
  colSizes: string[];
  headers?: string[];
  data: () => JSX.Element[][];
}

export function TableStatic(props: TableGridProps){
  props.headers = props.headers ? props.headers  : [];
  return (
    <div class={styles["table-static"]}>
      <div class={styles.row + " " + styles.head}>
        <For each={props.headers}>
          {
            (cell,index) => (<div class={styles.cell} style={{width: props.colSizes[index()]}}>{cell}</div>)
          }
        </For>
      </div>
      <For each={props.data()}>
        {(row) => (
          <div class={styles.row}>
            <For each={row}>
              {
                (cell,index) => (<div class={styles.cell} style={{width: props.colSizes[index()]}}>{cell}</div>)
              }
            </For>
          </div>
        )}
      </For>
    </div>
  )
}