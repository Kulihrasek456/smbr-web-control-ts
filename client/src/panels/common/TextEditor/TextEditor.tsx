//#TODO cele prepsat
import { onMount, onCleanup, createSignal } from "solid-js";
import { EditorView, basicSetup } from "codemirror";
import { yaml } from "@codemirror/lang-yaml";

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// 1. Definuj styly pro konkrétní prvky syntaxe
const myHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: "darkorange" },
  { tag: t.variableName, color: "orange" }, // dříve .cm-def
  { tag: t.string, color: "goldenrod" },
  { tag: t.number, color: "yellow" },
  { tag: t.comment, color: "gray", fontStyle: "italic" },
  { tag: t.atom, color: "var(--acc-color-4)" },
  { tag: t.meta, color: "aliceblue" },
]);

// 2. Definuj celkový vzhled editoru (font, pozadí)
const myEditorTheme = EditorView.theme({
  "&": {
    fontFamily: '"Fira Code", monospace',
    backgroundColor: "#282c34", // tvoje barva pozadí
    color: "white"
  },
  ".cm-content": {
    caretColor: "orange"
  }
}, { dark: true });

interface TextEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function TextEditor(props: TextEditorProps) {
  let editorRef: HTMLDivElement | undefined;
  let view: EditorView | undefined;

  onMount(() => {
    if (editorRef) {
      view = new EditorView({
        doc: props.initialValue,
        extensions: [
          basicSetup,
          yaml(),
          myEditorTheme,
          syntaxHighlighting(myHighlightStyle),
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