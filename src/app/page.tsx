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
import { ViewMode } from "@/types/link";

export default function Home() {
  const { links, addLink, removeLink, updateLink, isLoaded } = useLinks();
  const { user, isLoading: authLoading } = useAuth();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: "login" | "register" }>({
    open: false,
    mode: "login",
  });

  const isAtLimit = !user && links.length >= FREE_LIMIT_CONST;

  const handleAddLink = async (url: string) => {
    if (isAtLimit) {
      setAuthModal({ open: true, mode: "register" });
      return;
    }
    await addLink(url);
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return links;
    const q = query.toLowerCase();
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q)
    );
  }, [links, query]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <Image
                  src="/icon.svg"
                  alt="LinkBox"
                  width={28}
                  height={28}
                  className="rounded-xl object-contain"
                  priority
                />
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  LinkBox
                </h1>
              </div>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 ml-9">
                よく使うURLにすぐアクセス
              </p>
            </div>

            {/* Hamburger menu */}
            {!authLoading && (
              <HamburgerMenu
                onLoginClick={() => setAuthModal({ open: true, mode: "login" })}
                onRegisterClick={() => setAuthModal({ open: true, mode: "register" })}
              />
            )}
          </div>

          {/* Logged-in badge */}
          {user && (
            <div className="mt-3 ml-9 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
                {user.email ?? "ログイン中"}
              </span>
            </div>
          )}
        </header>

        {/* Limit warning banner */}
        {isLoaded && !user && (
          <LimitBanner
            count={links.length}
            onLoginClick={() => setAuthModal({ open: true, mode: "login" })}
            onRegisterClick={() => setAuthModal({ open: true, mode: "register" })}
          />
        )}

        {/* URL Input */}
        <section className="mb-4">
          <URLInput onAdd={handleAddLink} disabled={isAtLimit} />
        </section>

        {/* Search + View toggle */}
        {isLoaded && links.length > 0 && (
          <section className="mb-5 flex items-center gap-2">
            <div className="flex-1">
              <SearchBar value={query} onChange={setQuery} count={filtered.length} />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/50 shrink-0">
              <button
                onClick={() => setViewMode("list")}
                aria-label="リスト表示"
                className={`p-1.5 rounded-lg transition-all duration-150 ${
                  viewMode === "list"
                    ? "bg-white dark:bg-zinc-700 text-indigo-500 shadow-sm"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                aria-label="グリッド表示"
                className={`p-1.5 rounded-lg transition-all duration-150 ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-700 text-indigo-500 shadow-sm"
                    : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
            </div>
          </section>
        )}

        {/* Link count */}
        {isLoaded && links.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wide">リンク</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
              {query ? `${filtered.length} / ${links.length}` : links.length}
              {!user && <span className="ml-1 text-zinc-300 dark:text-zinc-700">/ {FREE_LIMIT_CONST}</span>}
            </span>
          </div>
        )}

        {/* Link list */}
        <LinkList
          links={filtered}
          onRemove={removeLink}
          onUpdate={updateLink}
          query={query}
          isLoaded={isLoaded}
          viewMode={viewMode}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal((prev) => ({ ...prev, open: false }))}
        defaultMode={authModal.mode}
      />
    </div>
  );
}
