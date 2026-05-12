"use client";

import { useState, useRef, FormEvent } from "react";

interface URLInputProps {
  onAdd: (url: string) => Promise<void>;
  disabled?: boolean;
}

export function URLInput({ onAdd, disabled = false }: URLInputProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [pasteHint, setPasteHint] = useState<"success" | "error" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading || disabled) return;
    setLoading(true);
    await onAdd(value);
    setValue("");
    setLoading(false);
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    const input = inputRef.current;
    if (!input || disabled) return;
    input.focus();

    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          const normalized = /^https?:\/\//i.test(text) ? text : `https://${text}`;
          setValue(normalized);
          setPasteHint("success");
          setTimeout(() => setPasteHint(null), 2000);
          return;
        }
      } catch {}
    }

    try {
      const result = document.execCommand("paste");
      if (result) {
        setTimeout(() => {
          const current = inputRef.current?.value ?? "";
          if (current) {
            setValue(current);
            setPasteHint("success");
            setTimeout(() => setPasteHint(null), 2000);
          }
        }, 100);
        return;
      }
    } catch {}

    input.select();
    setPasteHint("error");
    setTimeout(() => setPasteHint(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={disabled ? "ログインして続けて追加..." : "URLを貼り付けて追加..."}
            disabled={disabled}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className={`
              w-full pl-10 pr-4 py-3 rounded-xl text-sm
              border text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent
              transition-all duration-150 shadow-sm
              ${disabled
                ? "bg-zinc-100 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/40 cursor-not-allowed opacity-60"
                : "bg-white dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/60"
              }
            `}
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || loading || disabled}
          className="
            flex items-center justify-center gap-1.5
            px-4 py-3 rounded-xl text-sm font-medium
            bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700
            disabled:opacity-40 disabled:cursor-not-allowed
            text-white transition-all duration-150 shadow-sm shrink-0
          "
        >
          {loading ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )}
          <span className="hidden sm:inline">追加</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handlePaste}
        disabled={disabled}
        className={`
          w-full flex items-center justify-center gap-2
          py-2 rounded-xl text-xs font-medium
          border transition-all duration-150
          ${disabled ? "opacity-40 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700/50"
            : pasteHint === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
            : pasteHint === "error" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
            : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-700/50"
          }
        `}
      >
        {pasteHint === "success" ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>貼り付けました</>
        ) : pasteHint === "error" ? (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>入力欄を長押しして「ペースト」を選んでください</>
        ) : (
          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>クリップボードのURLを貼り付け</>
        )}
      </button>
    </form>
  );
}
