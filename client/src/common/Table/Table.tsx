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
