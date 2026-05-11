"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLinks } from "@/hooks/useLinks";
import { URLInput } from "@/components/URLInput";
import { SearchBar } from "@/components/SearchBar";
import { LinkList } from "@/components/LinkList";

export default function Home() {
  const { links, addLink, removeLink, isLoaded } = useLinks();
  const [query, setQuery] = useState("");

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
      {/* Subtle background texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-12 pb-24">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2.5 mb-1">
            <Image
              src="/img/logo.png"
              alt="LinkBox"
              width={28}
              height={28}
              className="rounded-lg object-contain"
              priority
            />
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              LinkBox
            </h1>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 ml-9">
            よく使うURLをすぐにアクセス
          </p>
        </header>

        {/* URL Input */}
        <section className="mb-4">
          <URLInput onAdd={addLink} />
        </section>

        {/* Search — only show when there are links */}
        {isLoaded && links.length > 0 && (
          <section className="mb-5">
            <SearchBar
              value={query}
              onChange={setQuery}
              count={filtered.length}
            />
          </section>
        )}

        {/* Link count label */}
        {isLoaded && links.length > 0 && (
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-wide">
              リンク
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
              {query ? `${filtered.length} / ${links.length}` : links.length}
            </span>
          </div>
        )}

        {/* Link list */}
        <LinkList
          links={filtered}
          onRemove={removeLink}
          query={query}
          isLoaded={isLoaded}
        />
      </div>
    </div>
  );
}
