"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLinks } from "@/hooks/useLinks";
import { useAuth } from "@/context/AuthContext";
import { URLInput } from "@/components/URLInput";
import { SearchBar } from "@/components/SearchBar";
import { LinkList } from "@/components/LinkList";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { AuthModal } from "@/components/AuthModal";
import { LimitBanner, FREE_LIMIT_CONST } from "@/components/LimitBanner";
import { EditLinkModal } from "@/components/EditLinkModal";
import { CategoryModal } from "@/components/CategoryModal";
import { DataModal } from "@/components/DataModal";
import { LinkItem, ViewMode, CATEGORY_COLORS } from "@/types/link";

type FilterMode = "all" | "bookmarked" | string;

export default function Home() {
  const {
    links, categories, isLoaded,
    addLink, removeLink, updateLink, toggleBookmark, setLinkCategory,
    addCategory, updateCategory, removeCategory, importLinks,
  } = useLinks();

  const { user, isLoading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({ open: false, mode: "login" });
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);

  const isAtLimit = !user && links.length >= FREE_LIMIT_CONST;

  const handleAddLink = async (url: string) => {
    if (isAtLimit) { setAuthModal({ open: true, mode: "register" }); return; }
    await addLink(url);
  };

  const filtered = useMemo(() => {
    let result = [...links];
    if (filterMode === "bookmarked") result = result.filter((l) => l.bookmarked);
    else if (filterMode !== "all") result = result.filter((l) => l.categoryId === filterMode);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q));
    }
    // ブックマークを先頭に並べる（bookmarkedフィルター時以外）
    if (filterMode !== "bookmarked") {
      result.sort((a, b) => {
        if (a.bookmarked && !b.bookmarked) return -1;
        if (!a.bookmarked && b.bookmarked) return 1;
        return b.createdAt - a.createdAt;
      });
    }
    return result;
  }, [links, query, filterMode]);

  const bookmarkedCount = links.filter((l) => l.bookmarked).length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: "24px 24px" }} />

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Image src="/icon.svg" alt="LinkBox" width={28} height={28} className="rounded-xl object-contain" priority />
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">LinkBox</h1>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 ml-9">よく使うURLにすぐアクセス</p>
            </div>
            {!authLoading && (
              <HamburgerMenu
                onLoginClick={() => setAuthModal({ open: true, mode: "login" })}
                onRegisterClick={() => setAuthModal({ open: true, mode: "register" })}
                onDataClick={() => setDataModalOpen(true)}
              />
            )}
          </div>
          {user && (
            <div className="mt-3 ml-9 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">{user.email ?? "ログイン中"}</span>
            </div>
          )}
        </header>

        {/* Limit banner */}
        {isLoaded && !user && (
          <LimitBanner count={links.length}
            onLoginClick={() => setAuthModal({ open: true, mode: "login" })}
            onRegisterClick={() => setAuthModal({ open: true, mode: "register" })}
          />
        )}

        {/* URL Input */}
        <section className="mb-4">
          <URLInput onAdd={handleAddLink} disabled={isAtLimit} />
        </section>

        {/* Filter tabs */}
        {isLoaded && links.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setFilterMode("all")}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  filterMode === "all" ? "bg-indigo-500 text-white border-indigo-500" : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                }`}
              >
                すべて
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterMode === "all" ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"}`}>{links.length}</span>
              </button>

              {bookmarkedCount > 0 && (
                <button
                  onClick={() => setFilterMode("bookmarked")}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    filterMode === "bookmarked" ? "bg-amber-400 text-white border-amber-400" : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                  }`}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  ブックマーク
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filterMode === "bookmarked" ? "bg-white/20" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"}`}>{bookmarkedCount}</span>
                </button>
              )}

              {categories.map((cat) => {
                const col = CATEGORY_COLORS.find((c) => c.key === cat.color) ?? CATEGORY_COLORS[0];
                const count = links.filter((l) => l.categoryId === cat.id).length;
                const active = filterMode === cat.id;
                return (
                  <button key={cat.id} onClick={() => setFilterMode(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      active ? `${col.bg} ${col.text} ${col.border}` : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                    }`}
                  >
                    <span>{cat.icon}</span>{cat.name}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-black/10 dark:bg-black/20" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"}`}>{count}</span>
                  </button>
                );
              })}

              <button onClick={() => setCategoryModalOpen(true)}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all bg-white dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 border-dashed hover:border-zinc-400 hover:text-zinc-600"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                カテゴリー
              </button>
            </div>
          </section>
        )}

        {/* Search + View toggle */}
        {isLoaded && links.length > 0 && (
          <section className="mb-5 flex items-center gap-2">
            <div className="flex-1">
              <SearchBar value={query} onChange={setQuery} count={filtered.length} />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/50 shrink-0">
              <button onClick={() => setViewMode("list")} aria-label="リスト表示"
                className={`p-1.5 rounded-lg transition-all duration-150 ${viewMode === "list" ? "bg-white dark:bg-zinc-700 text-indigo-500 shadow-sm" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button onClick={() => setViewMode("grid")} aria-label="グリッド表示"
                className={`p-1.5 rounded-lg transition-all duration-150 ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 text-indigo-500 shadow-sm" : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
          </section>
        )}

        {/* Count */}
        {isLoaded && links.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wide">リンク</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
              {query || filterMode !== "all" ? `${filtered.length} / ${links.length}` : links.length}
              {!user && <span className="ml-1 text-zinc-300 dark:text-zinc-700">/ {FREE_LIMIT_CONST}</span>}
            </span>
          </div>
        )}

        <LinkList
          links={filtered} categories={categories}
          onRemove={removeLink} onEdit={setEditingLink}
          onToggleBookmark={toggleBookmark}
          query={query} isLoaded={isLoaded} viewMode={viewMode}
        />

        {/* Footer links */}
        <footer className="mt-16 flex items-center justify-center gap-4">
          <a href="/terms" target="_blank" className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">利用規約</a>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <a href="/privacy" target="_blank" className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">プライバシーポリシー</a>
        </footer>
      </div>

      {/* Modals */}
      <AuthModal isOpen={authModal.open} onClose={() => setAuthModal((p) => ({ ...p, open: false }))} defaultMode={authModal.mode} />
      <EditLinkModal link={editingLink} categories={categories} onClose={() => setEditingLink(null)} onSave={updateLink} onSetCategory={setLinkCategory} />
      <CategoryModal isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} categories={categories} onAdd={addCategory} onUpdate={updateCategory} onRemove={removeCategory} />
      <DataModal isOpen={dataModalOpen} onClose={() => setDataModalOpen(false)} links={links} categories={categories} onImport={importLinks} />
    </div>
  );
}
