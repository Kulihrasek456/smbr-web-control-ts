import { onMount, onCleanup, createSignal } from "solid-js";
import { EditorView, basicSetup } from "codemirror";
import { yaml } from "@codemirror/lang-yaml";

import { syntaxHighlighting, indentUnit } from "@codemirror/language";

import { customTheme, customSyntaxHighligting } from "./CodeMirrorWrapperTheme";

import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";

interface CodeMirrorWrapperProps {
  initialValue: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function CodeMirrorWrapper(props: CodeMirrorWrapperProps) {
  let editorRef: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  const saveKeybind = keymap.of([
    {
      key: "Mod-s",
      run: (view) => {
        props.onSave();
        
        // block event propagation
        return true;
      },
    }
  ]);

  onMount(() => {
    if (editorRef) {
      view = new EditorView({
        doc: props.initialValue,
        extensions: [
          basicSetup,
          indentUnit.of("    "),
          EditorState.tabSize.of(4),
          keymap.of([indentWithTab]),
          saveKeybind,
          yaml(),
          customTheme,
          syntaxHighlighting(customSyntaxHighligting),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              props.onChange(update.state.doc.toString());
            }
          }),
        ],
        parent: editorRef,
      });
    }
  });

  onCleanup(() => {
    view?.destroy();
  });


  

  return (
    <div 
      ref={editorRef} 
      class="border border-gray-700 rounded-md overflow-hidden h-full"
    />
  );
}