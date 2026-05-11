"use client";

import { useState, useRef, FormEvent } from "react";

interface URLInputProps {
  onAdd: (url: string) => Promise<void>;
}

export function URLInput({ onAdd }: URLInputProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    await onAdd(value);
    setValue("");
    setLoading(false);
    inputRef.current?.focus();
  };

  // 現在のタブのURLを取得（Chrome拡張なしではアクセス不可のため、
  // clipboardからの貼り付けをサポート）
  const handlePasteCurrentTab = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && /^https?:\/\//i.test(text)) {
        setValue(text);
        inputRef.current?.focus();
      }
    } catch {
      inputRef.current?.focus();
    }
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
            placeholder="URLを貼り付けて追加..."
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="
              w-full pl-10 pr-4 py-3 rounded-xl text-sm
              bg-white dark:bg-zinc-800/80
              border border-zinc-200 dark:border-zinc-700/60
              text-zinc-900 dark:text-zinc-100
              placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent
              transition-all duration-150
              shadow-sm
            "
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="
            flex items-center justify-center gap-1.5
            px-4 py-3 rounded-xl text-sm font-medium
            bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700
            disabled:opacity-40 disabled:cursor-not-allowed
            text-white
            transition-all duration-150
            shadow-sm
            shrink-0
          "
        >
          {loading ? (
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          )}
          <span className="hidden sm:inline">追加</span>
        </button>
      </div>

      {/* 現在のタブを追加ボタン */}
      <button
        type="button"
        onClick={handlePasteCurrentTab}
        className="
          w-full flex items-center justify-center gap-2
          py-2 rounded-xl text-xs font-medium
          bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80
          text-zinc-500 dark:text-zinc-400
          border border-zinc-200/80 dark:border-zinc-700/50
          transition-all duration-150
        "
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        クリップボードのURLを貼り付け
      </button>
    </form>
  );
}
