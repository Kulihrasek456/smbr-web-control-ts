import { onMount, onCleanup, type JSX, createEffect } from "solid-js";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.css";
import styles from "./GridstackGrid.module.css"
import "./GridstackGrid.css"

interface GridProps {
  children: JSX.Element;
  cellHeight?: string | number;
}

export function GridstackGrid(props: GridProps){
  let gridElement: HTMLDivElement | undefined;
  let gridInstance: GridStack | null = null;

  onMount(() => {
    if (gridElement) {
      // Gridstack initialization
      gridInstance = GridStack.init({
        cellHeight: props.cellHeight || "100px",
        styleInHead: true,
        margin: 12,
        float: true,
        draggable: {
          handle: '.drag-handle',
        },
        columnOpts: {
          // number of collumns based on the width
          breakpoints: [
            { w: 500,  c: 1 },
            { w: 1000, c: 2 },
            { w: 1500, c: 3 },
            { w: 2000, c: 4 },
            { w: 2500, c: 5 },
            { w: 3000, c: 6 }
          ]
        },
        disableResize: true
      }, gridElement);

      // Event listener for layout changes
      gridInstance.on('change', (event, items) => {
        console.log('Layout changes:', items);
      });
    }
  });

  onCleanup(() => {
    if (gridInstance) {
      gridInstance.destroy(false);
    }
  });

  return (
    <div 
      ref={gridElement} 
      class="grid-stack" 
    >
      {props.children}
    </div>
  );
};

interface GridElementProps {
  id: string;
  x?: number;
  y?: number;
  w: number;
  h: number;
  children: JSX.Element;
}

export function GridElement(props: GridElementProps){
  let gridElement: HTMLDivElement | undefined;
  let grid : GridStack | undefined;

  onMount(() => {
    if(gridElement){
      let gridParent = gridElement.parentElement || undefined
      
      if(!gridParent){
        return
      }

      //check if the parent is a gridstack grid
      if(!(gridParent as any).gridstack){
        gridParent=undefined;
        return 
      }

      // check if the grid element needs to be initializated manually
      if(!(gridElement as any).gridstackNode){
        grid = (gridParent as any).gridstack;
        grid?.makeWidget(gridElement);
      }
    }
  })

  onCleanup(()=>{
    if(gridElement && grid){
      grid.removeWidget(gridElement)
    }
  })

  createEffect(() => {
    const w = props.w;
    const h = props.h;

    try {
      // gridstack puts the grid into the gridstack property
      const grid = (gridElement?.parentElement as any).gridstack;
      if (grid && gridElement) {
        grid.update(gridElement, { w, h });
      }
    } catch (error) {
      
    }

  });
  
  return (
    <div 
      ref={gridElement}
      class="grid-stack-item" 
      gs-id={props.id}
      gs-x={props.x} 
      gs-y={props.y} 
      gs-w={props.w} 
      gs-h={props.h}
    >
      <div class={"grid-stack-item-content " + styles.element}>
        {props.children}
      </div>
    </div>
  );
};