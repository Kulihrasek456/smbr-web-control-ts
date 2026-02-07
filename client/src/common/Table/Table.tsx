import { For, type JSXElement } from "solid-js";
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


interface TableStaticProps<T> {
  data: T[];
  headers: string[];
  colSizes: (string | undefined)[];
  renderRow: (item: T, index: number) => JSX.Element[];
  fillHeight? : boolean
}

export function TableStatic<T>(props: TableStaticProps<T>){
  props.headers = props.headers ? props.headers  : [];

  function renderRow(cell : string | JSX.Element, index : ()=>number){
    return (
      <div
        class={styles.cell}
        style={{
          "width": props.colSizes[index()] ?? "100%",
          "min-width": props.colSizes[index()] ?? "0px",
          "flex": props.colSizes[index()] ? "0 0 auto" : "1 1 auto"
        }}
      >{cell}</div>
    )
  }
  
  return (
    <div class={styles["table-static"] + " " + ((props.fillHeight ?? false)?styles.fill_height:"")}>
      <div class={styles.row + " " + styles.head}>
        <For each={props.headers}>
          {(cell, index) => renderRow(cell,index)}
        </For>
      </div>
      <For each={props.data}>
        {(rowData, index) => (
          <div class={styles.row}>
            <For each={props.renderRow(rowData, index())}>
              {(cell, index) => renderRow(cell,index)}
            </For>
          </div>
        )}
      </For>
    </div>
  )
}