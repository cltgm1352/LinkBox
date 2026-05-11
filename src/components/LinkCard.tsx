"use client";

import { useState } from "react";
import { LinkItem } from "@/types/link";
import { extractDomain } from "@/lib/metadata";

interface LinkCardProps {
  link: LinkItem;
  onRemove: (id: string) => void;
}

export function LinkCard({ link, onRemove }: LinkCardProps) {
  const [imgError, setImgError] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(link.id), 200);
  };

  const domain = extractDomain(link.url);

  return (
    <div
      className={`
        group relative
        transition-all duration-200
        ${removing ? "opacity-0 scale-95" : "opacity-100 scale-100"}
      `}
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          flex items-center gap-3 px-4 py-3.5 pr-11 rounded-xl
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

      {/* Delete button — always visible */}
      <button
        onClick={handleRemove}
        aria-label="削除"
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          w-7 h-7 rounded-lg
          flex items-center justify-center
          text-zinc-300 dark:text-zinc-600
          hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10
          transition-all duration-150
          z-10
        "
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}
