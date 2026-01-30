import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { EditorView } from "codemirror";


export const customTheme = EditorView.theme({
    // container
    "&": {
        color: "var(--text-color-light)",
        backgroundColor: "var(--bg-color-2)",
        fontSize: "14px",
        height: "100%"
    },
    ".cm-scroller": {
        overflow: "auto", // Povolí scrollbar uvnitř editoru
        flex: "1 1 auto"
    },

    // also text cursor
    ".cm-content": {
        caretColor: "white",
        fontFamily: "JetBrains Mono, monospace"
    },

    // text cursor
    "&.cm-focused .cm-cursor": {
        borderLeftColor: "white"
    },

    // text selection while focused
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
        backgroundColor: "rgba(255,255,255, 0.2) !important", // Červená s průhledností je obvykle lepší
    },

    // text selection native support
    "& ::selection": {
        backgroundColor: "rgba(var(--acc-color-4-rgb), 0.3) !important"
    },


    // bracket higlight
    "&.cm-focused .cm-matchingBracket": {
        backgroundColor: "transparent",
        outline: "1px solid var(--text-color-light)"
    },

    // gutter container
    ".cm-gutters": {
        backgroundColor: "var(--bg-color-3)",

        borderRight: "1px solid var(--bg-color-5)"
    },
    // line number gutter
    ".cm-lineNumbers": {
        minWidth: "40px",
        textAlign: "right"
    },
    // active line
    ".cm-activeLine": {
        backgroundColor: "transparent !important"
    },
    // active line gutter
    ".cm-activeLineGutter": {
        backgroundColor: "var(--bg-color-4)"
    }
}, { dark: true });


export const customSyntaxHighligting = HighlightStyle.define([
    { tag: t.keyword, color: "darkorange", fontWeight: "bold" },
    { tag: t.string, color: "goldenrod" },
    { tag: t.special(t.brace), color: "blueviolet"},
    { tag: [t.variableName, t.propertyName, t.labelName], color: "var(--acc-color-4)" },
    { tag: [t.function(t.variableName)], color: "var(--acc-color-4)" },
    { tag: t.comment, color: "gray", fontStyle: "italic" },
    { tag: t.number, color: "yellow" },
    { tag: t.className, color: "blueviolet" },
    
    // --- YAML specific ---
    { tag: [t.bool, t.null], color: "indianred", fontWeight: "bold" }, // true/false/null
    { tag: t.operator, color: "blueviolet" },                              // operators such as <<
    { tag: t.punctuation, color: "white" },                            // : , [ ] -
    { tag: t.heading, color: "darkorange", fontWeight: "bold" }       // markdown
]);