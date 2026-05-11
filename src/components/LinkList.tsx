"use client";

import { LinkItem, ViewMode } from "@/types/link";
import { LinkCard } from "./LinkCard";

interface LinkListProps {
  links: LinkItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, url: string) => Promise<void>;
  query: string;
  isLoaded: boolean;
  viewMode: ViewMode;
}

export function LinkList({ links, onRemove, onUpdate, query, isLoaded, viewMode }: LinkListProps) {
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (links.length === 0 && !query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">リンクがまだありません</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">URLを入力して追加してみましょう</p>
        </div>
      </div>
    );
  }

  if (links.length === 0 && query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          &ldquo;{query}&rdquo; に一致するリンクが見つかりません
        </p>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} onRemove={onRemove} onUpdate={onUpdate} viewMode="grid" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onRemove={onRemove} onUpdate={onUpdate} viewMode="list" />
      ))}
    </div>
  );
}
