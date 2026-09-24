import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiTerminal, FiX } from "react-icons/fi";
import Editor from "@monaco-editor/react";

const LANG_OPTION = ["javascript", "python", "java", "cpp"];
const DEFAULT_CODE = {
  javascript: `function solve() {
  // your code here
}`,

  python: `def solve():
    # your code here
    pass`,
  java: `public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`,
};

const handleEditorWillMount = (monaco) => {
  monaco.editor.defineTheme("editor-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#0e1016",
      "editor.lineHighlightBackground": "#ffffff08",
      "editorLineNumber.foreground": "#ffffff30",
      "editorLineNumber.activeForeground": "#ffffff70",
      "editorCursor.foreground": "#ffffff",
      "editor.selectionBackground": "#ffffff20",
      "editorGutter.background": "#0e1016",
    },
  });
};

const CodeEditor = ({ onClose, onSubmitCode }) => {
  const [lang, setLang] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE["javascript"]);

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-3 top-4 bottom-4 sm:inset-x-6 sm:top-6 sm:bottom-6 md:inset-x-10 md:top-8 md:bottom-8 z-50 flex flex-col overflow-hidden rounded-2xl bg-[#0e1016] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute inset-0 bg-linear-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between gap-2 px-3 sm:px-5 h-12 sm:h-14 border-b border-white/8 shrink-0">
            <div className="flex items-center gap-2 shrink-0">
              <FiTerminal className="text-white/50" size={15} />
              <span className="hidden sm:inline text-sm font-semibold text-white">
                Code Editor
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
              {LANG_OPTION.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setCode(DEFAULT_CODE[l]);
                  }}
                  className={`shrink-0 cursor-pointer text-xs px-2.5 py-1.5 rounded-lg capitalize transition-all ${
                    lang === l
                      ? "bg-white text-[#0a0a0a] font-semibold"
                      : "text-white/40 hover:text-white/70 hover:bg-white/8"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="shrink-0 cursor-pointer p-1.5 -mr-1 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/8 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Editor */}
          <div className="relative flex-1 min-h-0 bg-[#0e1016]">
            <Editor
              height="100%"
              language={lang}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="editor-dark"
              beforeMount={handleEditorWillMount}
              loading={
                <div className="flex items-center justify-center h-full w-full text-white/30 text-sm">
                  Loading editor...
                </div>
              }
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                automaticLayout: true,
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Footer */}
          <div className="relative border-t border-white/8 px-3 sm:px-5 py-3 flex justify-end shrink-0">
            <button
              onClick={() => onSubmitCode?.(code)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs sm:text-sm px-4 py-2 rounded-lg bg-white text-[#0a0a0a] font-semibold hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
            >
              Add To Answer
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CodeEditor;