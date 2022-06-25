import { EditorView } from "@codemirror/view"
import { useCallback, useState } from "react"
import * as view from "@codemirror/view"
import { Extension, EditorState } from "@codemirror/state"
import * as language from "@codemirror/language"
import * as commands from "@codemirror/commands"
import * as search from "@codemirror/search"
import * as autocomplete from "@codemirror/autocomplete"
import * as lint from "@codemirror/lint"
import * as js from "@codemirror/lang-javascript"
import * as one_dark from "@codemirror/theme-one-dark"

export default function Page() {
  const [state, setState] = useState<EditorState>()
  const [view, setView] = useState<EditorView>()

  const callbackRef = useCallback((element: HTMLElement | null) => {
    if (element) {
      const newState = EditorState.create({
        extensions: extensions,
        doc: template,
      })
      const newView = new EditorView({
        state: newState,
        parent: element,
      })
      setState(newState)
      setView(newView)
    }
  }, [])

  return <main id="codemirror" className="w-full h-screen [&_.cm-editor]:h-full" ref={callbackRef} />
}

// -- CODEMIRROR EXTENSIONS

const extensions: Extension[] = [
  EditorState.allowMultipleSelections.of(true),
  commands.history(),
  language.foldGutter(),
  language.indentOnInput(),
  language.syntaxHighlighting(language.defaultHighlightStyle, { fallback: true }),
  language.bracketMatching(),
  autocomplete.closeBrackets(),
  autocomplete.autocompletion(),
  search.highlightSelectionMatches(),
  view.lineNumbers(),
  view.highlightActiveLineGutter(),
  view.highlightSpecialChars(),
  view.drawSelection(),
  view.dropCursor(),
  view.rectangularSelection(),
  view.crosshairCursor(),
  view.highlightActiveLine(),
  view.keymap.of([
    ...autocomplete.closeBracketsKeymap,
    ...commands.defaultKeymap,
    ...search.searchKeymap,
    ...commands.historyKeymap,
    ...language.foldKeymap,
    ...autocomplete.completionKeymap,
    ...lint.lintKeymap,
  ]),
  EditorView.lineWrapping,
  js.javascript({ typescript: true }),
  one_dark.oneDark,
]

// -- TEMPLATE

const template = `// Notice the difference between the X (line 3) and the Y (line 4).
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

// Notice the difference between the "in keyof T" in line 7 and the one in line 10.
export type Debug<T> = { [K in keyof T]: T[K] }
export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T`
