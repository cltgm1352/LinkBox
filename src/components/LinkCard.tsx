"use client";

import { useState, useRef, useEffect } from "react";
import { LinkItem } from "@/types/link";
import { extractDomain } from "@/lib/metadata";
import { ViewMode } from "@/types/link";

interface LinkCardProps {
  link: LinkItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, url: string) => Promise<void>;
  viewMode: ViewMode;
}

export function LinkCard({ link, onRemove, onUpdate, viewMode }: LinkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(link.url);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setEditValue(link.url);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [editing, link.url]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(link.id), 200);
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editValue.trim() || saving) return;
    setSaving(true);
    await onUpdate(link.id, editValue);
    setSaving(false);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditing(false);
  };

  const domain = extractDomain(link.url);

  // ── GRID MODE ──────────────────────────────────────────
  if (viewMode === "grid") {
    return (
      <div
        className={`
          relative flex flex-col
          transition-all duration-200
          ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
        `}
      >
        {editing ? (
          <div className="rounded-xl bg-white dark:bg-zinc-800/80 border border-indigo-400 dark:border-indigo-500/70 p-3 shadow-md flex flex-col gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="
                w-full px-2 py-1.5 rounded-lg text-xs
                bg-zinc-50 dark:bg-zinc-900
                border border-zinc-200 dark:border-zinc-700
                text-zinc-900 dark:text-zinc-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              "
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 transition-colors"
              >
                {saving ? "保存中..." : "保存"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex flex-col items-center gap-2.5 p-4 rounded-xl
                bg-white dark:bg-zinc-800/80
                border border-zinc-100 dark:border-zinc-700/50
                hover:border-indigo-300 dark:hover:border-indigo-500/50
                hover:shadow-md hover:shadow-indigo-500/5
                active:scale-[0.98]
                transition-all duration-150
                no-underline
                pb-3
              "
            >
              {/* Large favicon */}
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden shadow-sm">
                {link.favicon && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={link.favicon}
                    alt=""
                    width={40}
                    height={40}
                    onError={() => setImgError(true)}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-500 uppercase select-none">
                    {domain.charAt(0)}
                  </span>
                )}
              </div>
              {/* Title */}
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center line-clamp-2 leading-snug w-full px-1">
                {link.title}
              </p>
            </a>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                onClick={handleEditStart}
                aria-label="編集"
                className="
                  w-6 h-6 rounded-md flex items-center justify-center
                  bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm
                  text-zinc-400 dark:text-zinc-500
                  hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                  border border-zinc-200/50 dark:border-zinc-700/50
                  transition-all duration-150
                "
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                onClick={handleRemove}
                aria-label="削除"
                className="
                  w-6 h-6 rounded-md flex items-center justify-center
                  bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm
                  text-zinc-400 dark:text-zinc-500
                  hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
                  border border-zinc-200/50 dark:border-zinc-700/50
                  transition-all duration-150
                "
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ── LIST MODE ──────────────────────────────────────────
  return (
    <div
      className={`
        relative
        transition-all duration-200
        ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      {editing ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-indigo-400 dark:border-indigo-500/70 shadow-md">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
              flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm
              bg-zinc-50 dark:bg-zinc-900
              border border-zinc-200 dark:border-zinc-700
              text-zinc-900 dark:text-zinc-100
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            "
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 transition-colors"
          >
            {saving ? "..." : "保存"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-3 px-4 py-3.5 pr-20 rounded-xl
              bg-white dark:bg-zinc-800/80
              border border-zinc-100 dark:border-zinc-700/50
              hover:border-indigo-300 dark:hover:border-indigo-500/50
              hover:shadow-md hover:shadow-indigo-500/5
              active:scale-[0.99]
              transition-all duration-150
              cursor-pointer
              no-underline
            "
          >
            {/* Favicon */}
            <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
              {link.favicon && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={link.favicon}
                  alt=""
                  width={20}
                  height={20}
                  onError={() => setImgError(true)}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase select-none">
                  {domain.charAt(0)}
                </span>
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate leading-snug">
                {link.title}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                {domain}
              </p>
            </div>
          </a>

          {/* Edit + Delete buttons — always visible */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={handleEditStart}
              aria-label="編集"
              className="
                w-7 h-7 rounded-lg flex items-center justify-center
                text-zinc-300 dark:text-zinc-600
                hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                transition-all duration-150
              "
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              onClick={handleRemove}
              aria-label="削除"
              className="
                w-7 h-7 rounded-lg flex items-center justify-center
                text-zinc-300 dark:text-zinc-600
                hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
                transition-all duration-150
              "
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
