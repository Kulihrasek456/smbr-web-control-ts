import { createEffect, createSignal, For, type JSXElement } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import isEqual from "fast-deep-equal";
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
  const [data, setData] = createSignal<T[]>([]);
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

  function updateItemsSafely(newData: T[], oldData: T[]){    
    const reconciledData = newData.map((newItem, index) => {
      const oldItem = oldData[index];
      if (oldItem && isEqual(oldItem, newItem)) {
        return oldItem;
      }
      return newItem;
    });

    return reconciledData;
  };

  let oldData : T[] = [];
  createEffect(()=>{
    oldData = updateItemsSafely(props.data,oldData);
    setData(oldData);
  })
  
  return (
    <div class={styles["table-static"] + " " + ((props.fillHeight ?? false)?styles.fill_height:"")}>
      <div class={styles.row + " " + styles.head}>
        <For each={props.headers}>
          {(cell, index) => renderRow(cell,index)}
        </For>
      </div>
      <For each={data()}>
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


export function widgetHeightChange(numOfRows : number, settings?: {rowHeight?: number, widgetRowHeight?: number, addedPixels?: number}){
  const rowHeight = settings?.rowHeight ?? 24;
  const widgetRowHeight = settings?.widgetRowHeight ?? 100;
  const addedPixels = settings?.addedPixels ?? 0;
  
  let pixels = addedPixels;        

  pixels += 15;                     // 15 for the header
  pixels += 85;                     // 64 for the widget header
  pixels += numOfRows*rowHeight;    // for every row

  let rows = Math.trunc(pixels / widgetRowHeight);
  if((pixels - rows*widgetRowHeight) > 0){
    rows+=1;
  }
  return rows;
}