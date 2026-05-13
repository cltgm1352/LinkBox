"use client";

import { useState, useEffect, useRef } from "react";
import { LinkItem, Category, CATEGORY_COLORS } from "@/types/link";

interface EditLinkModalProps {
  link: LinkItem | null;
  categories: Category[];
  onClose: () => void;
  onSave: (id: string, patch: { url?: string; title?: string }) => Promise<void>;
  onSetCategory: (id: string, categoryId: string | null) => void;
}

export function EditLinkModal({ link, categories, onClose, onSave, onSetCategory }: EditLinkModalProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (link) { setUrl(link.url); setTitle(link.title); }
  }, [link]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (link) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [link, onClose]);

  if (!link) return null;

  const handleSave = async () => {
    if (!url.trim() || saving) return;
    setSaving(true);
    await onSave(link.id, { url: url.trim(), title: title.trim() || undefined });
    setSaving(false);
    onClose();
  };

  // カテゴリー選択 → 即座に反映して自動で閉じる
  const handleCategorySelect = (categoryId: string | null) => {
    onSetCategory(link.id, categoryId);
    setTimeout(() => onClose(), 150); // 少し待ってから閉じる（視覚的フィードバックのため）
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">リンクを編集</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">サイト名</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="サイト名"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            />
          </div>

          {/* Category — 選択で自動クローズ */}
          {categories.length > 0 && (
            <div>
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
                カテゴリー
                <span className="ml-1.5 text-zinc-400 dark:text-zinc-600 font-normal">（選択すると閉じます）</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {/* なし */}
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${!link.categoryId
                      ? "bg-indigo-500 text-white ring-2 ring-indigo-400 ring-offset-1 dark:ring-offset-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                    }
                  `}
                >
                  なし
                </button>

                {categories.map((cat) => {
                  const col = CATEGORY_COLORS.find((c) => c.key === cat.color) ?? CATEGORY_COLORS[0];
                  const active = link.categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${active
                          ? `${col.bg} ${col.text} ${col.border} border ring-2 ring-offset-1 dark:ring-offset-zinc-900`
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                        }
                      `}
                      style={active ? { "--tw-ring-color": getRingColor(cat.color) } as React.CSSProperties : {}}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                      {active && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!url.trim() || saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 transition-all"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
            >
              キャンセル
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// カテゴリーカラーキーからring色を返す
function getRingColor(colorKey: string): string {
  const map: Record<string, string> = {
    zinc: "#71717a", red: "#f87171", orange: "#fb923c", amber: "#fbbf24",
    green: "#4ade80", teal: "#2dd4bf", blue: "#60a5fa", indigo: "#818cf8",
    purple: "#c084fc", pink: "#f472b6",
  };
  return map[colorKey] ?? "#818cf8";
}
