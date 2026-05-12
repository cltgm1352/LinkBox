"use client";

import { useState } from "react";
import { LinkItem, Category, CATEGORY_COLORS } from "@/types/link";
import { extractDomain } from "@/lib/metadata";
import { ViewMode } from "@/types/link";

interface LinkCardProps {
  link: LinkItem;
  categories: Category[];
  onRemove: (id: string) => void;
  onEdit: (link: LinkItem) => void;
  onToggleBookmark: (id: string) => void;
  viewMode: ViewMode;
}

export function LinkCard({ link, categories, onRemove, onEdit, onToggleBookmark, viewMode }: LinkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(link.id), 200);
  };
  const handleEdit = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onEdit(link); };
  const handleBookmark = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(link.id); };

  const domain = extractDomain(link.url);
  const category = categories.find((c) => c.id === link.categoryId);
  const catColor = category ? CATEGORY_COLORS.find((c) => c.key === category.color) : null;

  // ── GRID MODE ──
  if (viewMode === "grid") {
    return (
      <div className={`relative flex flex-col transition-all duration-200 ${removing ? "opacity-0 scale-95" : ""}`}>
        <a
          href={link.url} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-2.5 p-4 pb-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5 active:scale-[0.98] transition-all duration-150 no-underline"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden shadow-sm">
            {link.favicon && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.favicon} alt="" width={40} height={40} onError={() => setImgError(true)} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-500 uppercase select-none">{domain.charAt(0)}</span>
            )}
          </div>
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center line-clamp-2 leading-snug w-full px-1">{link.title}</p>
          {category && catColor && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>{category.icon} {category.name}</span>
          )}
        </a>
        {/* Grid action buttons */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button onClick={handleBookmark} className={`w-6 h-6 rounded-md flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50 transition-all ${link.bookmarked ? "text-amber-400" : "text-zinc-400 dark:text-zinc-500 hover:text-amber-400"}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill={link.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button onClick={handleEdit} className="w-6 h-6 rounded-md flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-zinc-200/50 dark:border-zinc-700/50 transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={handleRemove} className="w-6 h-6 rounded-md flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-400 dark:text-zinc-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-zinc-200/50 dark:border-zinc-700/50 transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // ── LIST MODE ──
  return (
    <div className={`relative transition-all duration-200 ${removing ? "opacity-0 scale-95" : ""}`}>
      <a
        href={link.url} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-3.5 pr-24 rounded-xl bg-white dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5 active:scale-[0.99] transition-all duration-150 no-underline"
      >
        <div className="shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
          {link.favicon && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={link.favicon} alt="" width={20} height={20} onError={() => setImgError(true)} className="w-5 h-5 object-contain" />
          ) : (
            <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase select-none">{domain.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate leading-snug">{link.title}</p>
            {category && catColor && (
              <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>{category.icon}</span>
            )}
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{domain}</p>
        </div>
      </a>

      {/* Action buttons: bookmark + edit + delete */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        <button onClick={handleBookmark} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${link.bookmarked ? "text-amber-400" : "text-zinc-300 dark:text-zinc-600 hover:text-amber-400"}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={link.bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
        <button onClick={handleEdit} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 dark:text-zinc-600 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onClick={handleRemove} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-300 dark:text-zinc-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}
