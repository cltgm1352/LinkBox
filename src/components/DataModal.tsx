"use client";

import { useState, useRef, useEffect } from "react";
import { LinkItem, Category } from "@/types/link";
import { exportLinksToCSV, downloadCSV, parseLinksCSV } from "@/lib/csv";

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkItem[];
  categories: Category[];
  onImport: (
    links: Omit<LinkItem, "id" | "createdAt">[],
    newCategoryNames: string[]
  ) => void;
}

export function DataModal({ isOpen, onClose, links, categories, onImport }: DataModalProps) {
  const [tab, setTab] = useState<"export" | "import">("export");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<{ count: number; newCats: string[]; errors: string[]; raw: Omit<LinkItem, "id" | "createdAt">[] } | null>(null);
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) { setPreview(null); setImportDone(false); }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    const csv = exportLinksToCSV(links, categories);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `linkbox-${date}.csv`);
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = parseLinksCSV(text);
      setPreview({ count: result.count, newCats: result.newCategoryNames, errors: result.errors, raw: result.links });
    };
    reader.readAsText(file, "utf-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleImportConfirm = () => {
    if (!preview) return;
    setImporting(true);
    onImport(preview.raw, preview.newCats);
    setTimeout(() => { setImporting(false); setImportDone(true); }, 400);
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
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">データ管理</h2>
            <p className="text-xs text-zinc-400 mt-0.5">CSVでエクスポート・インポート</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800">
          {(["export", "import"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setPreview(null); setImportDone(false); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-indigo-500 border-b-2 border-indigo-500"
                  : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              }`}
            >
              {t === "export" ? "エクスポート" : "インポート"}
            </button>
          ))}
        </div>

        <div className="px-5 py-4">
          {/* ── EXPORT ── */}
          {tab === "export" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">エクスポート内容</p>
                </div>
                <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 pl-1">
                  <li>・ 保存リンク：<strong className="text-zinc-700 dark:text-zinc-200">{links.length}件</strong></li>
                  <li>・ カテゴリー：<strong className="text-zinc-700 dark:text-zinc-200">{categories.length}件</strong></li>
                  <li>・ 形式：CSV（UTF-8）</li>
                </ul>
              </div>
              <button
                onClick={handleExport}
                disabled={links.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                CSVをダウンロード
              </button>
            </div>
          )}

          {/* ── IMPORT ── */}
          {tab === "import" && (
            <div className="space-y-3">
              {importDone ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">インポート完了</p>
                  <p className="text-xs text-zinc-400">{preview?.count}件のリンクを追加しました</p>
                  <button onClick={onClose} className="mt-2 px-4 py-2 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-all">
                    閉じる
                  </button>
                </div>
              ) : preview ? (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">インポート内容の確認</p>
                    <p className="text-xs text-zinc-500">リンク：<strong className="text-zinc-700 dark:text-zinc-200">{preview.count}件</strong></p>
                    {preview.newCats.length > 0 && (
                      <p className="text-xs text-zinc-500">新しいカテゴリー：<strong className="text-zinc-700 dark:text-zinc-200">{preview.newCats.join(", ")}</strong></p>
                    )}
                    {preview.errors.length > 0 && (
                      <div className="mt-1">
                        {preview.errors.map((err, i) => (
                          <p key={i} className="text-xs text-amber-600 dark:text-amber-400">{err}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleImportConfirm}
                      disabled={importing || preview.count === 0}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 transition-all"
                    >
                      {importing ? "追加中..." : `${preview.count}件を追加`}
                    </button>
                    <button
                      onClick={() => { setPreview(null); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      dragOver
                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/40"
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">CSVファイルを選択</p>
                    <p className="text-xs text-zinc-400">またはここにドラッグ&ドロップ</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  <p className="text-xs text-zinc-400 text-center">
                    LinkBoxでエクスポートしたCSVファイルを使用してください
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
