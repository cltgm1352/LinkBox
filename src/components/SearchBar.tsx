"use client";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  count: number;
}

export function SearchBar({ value, onChange, count }: SearchBarProps) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="検索..."
        className="
          w-full pl-9 pr-4 py-2.5 rounded-lg text-sm
          bg-zinc-100 dark:bg-zinc-800/60
          border border-transparent
          focus:border-zinc-300 dark:focus:border-zinc-600
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-400 dark:placeholder:text-zinc-500
          focus:outline-none focus:bg-white dark:focus:bg-zinc-800
          transition-all duration-150
        "
      />
      {count > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums pointer-events-none">
          {count}
        </span>
      )}
    </div>
  );
}
