"use client";

import { useState, useEffect, useRef } from "react";
import { Category, CATEGORY_COLORS } from "@/types/link";

const EMOJI_LIST = ["📁","🔖","⭐","🔥","💡","🛠","🎯","📚","🎵","🎨","🏠","💼","🌐","🔐","📊","🎮","🛒","✈️","🍔","📱"];

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string, icon: string, color: string) => void;
  onUpdate: (id: string, patch: Partial<Pick<Category, "name" | "icon" | "color">>) => void;
  onRemove: (id: string) => void;
}

export function CategoryModal({ isOpen, onClose, categories, onAdd, onUpdate, onRemove }: CategoryModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [color, setColor] = useState("indigo");
  const [editId, setEditId] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetForm = () => { setName(""); setIcon("📁"); setColor("indigo"); setEditId(null); };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (editId) {
      onUpdate(editId, { name: name.trim(), icon, color });
    } else {
      onAdd(name.trim(), icon, color);
    }
    resetForm();
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id); setName(cat.name); setIcon(cat.icon); setColor(cat.color);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">カテゴリー管理</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Form */}
          <div className="space-y-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {editId ? "カテゴリーを編集" : "新しいカテゴリー"}
            </p>

            {/* Emoji picker */}
            <div>
              <p className="text-xs text-zinc-400 mb-1.5">アイコン</p>
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => setIcon(e)}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                      icon === e ? "bg-indigo-100 dark:bg-indigo-500/20 ring-2 ring-indigo-400" : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <p className="text-xs text-zinc-400 mb-1.5">カラー</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c.key)}
                    title={c.label}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${c.bg} ${c.text} ${c.border} ${
                      color === c.key ? "ring-2 ring-offset-1 ring-indigo-400 dark:ring-offset-zinc-900" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="カテゴリー名"
              className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 transition-all"
              >
                {editId ? "更新" : "追加"}
              </button>
              {editId && (
                <button onClick={resetForm} className="px-3 py-2 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                  キャンセル
                </button>
              )}
            </div>
          </div>

          {/* Existing categories */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-0.5">登録済み</p>
              {categories.map((cat) => {
                const col = CATEGORY_COLORS.find((c) => c.key === cat.color) ?? CATEGORY_COLORS[0];
                return (
                  <div key={cat.id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${col.bg} ${col.border}`}>
                    <span className="text-lg">{cat.icon}</span>
                    <span className={`flex-1 text-sm font-medium ${col.text}`}>{cat.name}</span>
                    <button
                      onClick={() => startEdit(cat)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-indigo-500 hover:bg-white/60 dark:hover:bg-black/20 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemove(cat.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-white/60 dark:hover:bg-black/20 transition-all"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
