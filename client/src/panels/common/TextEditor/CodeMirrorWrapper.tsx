import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { EditorView, basicSetup } from "codemirror";
import { yaml } from "@codemirror/lang-yaml";

import { syntaxHighlighting, indentUnit } from "@codemirror/language";

import { customTheme, customSyntaxHighligting, setHighlightedLinesEffect, highlightedLinesField} from "./CodeMirrorWrapperTheme";

import { keymap, type EditorViewConfig } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { Compartment, EditorState, type EditorStateConfig } from "@codemirror/state";

const hideCursorTheme = EditorView.theme({
  ".cm-content": { caretColor: "transparent !important" },
  "&.cm-focused .cm-cursor": { display: "none !important" },
  "&.cm-focused .cm-selectionLayer .cm-selectionBackground": { background: "#d9d9d9" }
});

export interface CodeMirrorWrapperProps {
  initialValueGetter: ()=>string; // DO NOT USE THIS TO GET THE SAME VALUE AS SETTER, IT WILL CREATE AN INIFINITE LOOP
  highlightedLines?: number[];
  onChange?: (value: string) => void;
  onSave?: () => void;
  readOnly?: boolean;
}

export function CodeMirrorWrapper(props: CodeMirrorWrapperProps) {
  let editorRef: HTMLDivElement | undefined;
  let view: EditorView | undefined;
  const readOnlyCompartment = new Compartment();

  const saveKeybind = keymap.of([
    {
      key: "Mod-s",
      run: (view) => {
        props.onSave?.();
        
        // block event propagation
        return true;
      },
    }
  ]);

  function loadCustomCode(newCode : string){
    console.log("Code editor is loading new content");
    view?.setState(
      EditorState.create(getConfig(false,newCode))
    )
    /*
    this code changes only the value of the editor, ctrl+z etc remains
    if (view) {
      view.dispatch({
        changes: {
          from: 0, 
          to: view.state.doc.length,
          insert: newCode
        }
      });
    }
    */
  };

  function setHighlightedLines(lines : number[]){
    if(view){

      view.dispatch({
        effects: setHighlightedLinesEffect.of(lines)
      });
    }
  }

  function getConfig(initialization : boolean, value: string) : EditorStateConfig{
    let result : EditorViewConfig = {
        doc: value,
        extensions: [
          basicSetup,
          indentUnit.of("    "),
          EditorState.tabSize.of(4),
          keymap.of([indentWithTab]),
          saveKeybind,
          highlightedLinesField,
          yaml(),
          customTheme,
          readOnlyCompartment.of(EditorState.readOnly.of(props.readOnly ?? false)),
          syntaxHighlighting(customSyntaxHighligting),
          EditorView.updateListener.of((update) => {
            if (update.docChanged && props.onChange) {
              // a trick that checks if the change is tagged with one of the user events. if not, the change came from parent
              const isUserEvent = update.transactions.some(tr => 
                tr.isUserEvent("input") || 
                tr.isUserEvent("delete") || 
                tr.isUserEvent("move") ||
                tr.isUserEvent("paste")
              );
              if(isUserEvent){
                props.onChange(update.state.doc.toString());
              }
            }
          }),
        ],
      }
      if(initialization){
        result = {
          ...result,
          parent: editorRef
        }
      }
      return result
  }

  onMount(() => {
    if (editorRef) {
      view = new EditorView(getConfig(true,props.initialValueGetter()));
    }
  });

  onCleanup(() => {
    view?.destroy();
  });

  createEffect(()=>{
    loadCustomCode(props.initialValueGetter());
  });

  createEffect(() => {
    const isLocked = props.readOnly ?? false;
    if (view) {
      view.dispatch({
        effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(isLocked))
      });
    }
  });

  let lastLines : number[] = [];
  createEffect(()=>{
    if(props.highlightedLines){
      if(props.highlightedLines.length===lastLines.length){
        let changeDetected = false;
        for(let i = 0; i < lastLines.length; i++){
          if(lastLines[i] !== props.highlightedLines[i]){
            changeDetected = true;
            break;
          }
        }

        if(!changeDetected){
          return
        }
      }
      setHighlightedLines(props.highlightedLines)
    }
  })

  return (
    <div 
      ref={editorRef} 
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden"
      }}
    />
  );
}