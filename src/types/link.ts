export interface LinkItem {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
  createdAt: number;
  categoryId?: string | null;
  bookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;   // emoji
  color: string;  // tailwind color key e.g. "indigo"
  createdAt: number;
}

export type ViewMode = "list" | "grid";

export const CATEGORY_COLORS: { key: string; label: string; bg: string; text: string; border: string }[] = [
  { key: "zinc",    label: "グレー",    bg: "bg-zinc-100 dark:bg-zinc-800",       text: "text-zinc-600 dark:text-zinc-300",   border: "border-zinc-200 dark:border-zinc-700" },
  { key: "red",     label: "レッド",    bg: "bg-red-100 dark:bg-red-900/30",       text: "text-red-600 dark:text-red-400",     border: "border-red-200 dark:border-red-800" },
  { key: "orange",  label: "オレンジ",  bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  { key: "amber",   label: "アンバー",  bg: "bg-amber-100 dark:bg-amber-900/30",   text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  { key: "green",   label: "グリーン",  bg: "bg-green-100 dark:bg-green-900/30",   text: "text-green-600 dark:text-green-400", border: "border-green-200 dark:border-green-800" },
  { key: "teal",    label: "ティール",  bg: "bg-teal-100 dark:bg-teal-900/30",     text: "text-teal-600 dark:text-teal-400",   border: "border-teal-200 dark:border-teal-800" },
  { key: "blue",    label: "ブルー",    bg: "bg-blue-100 dark:bg-blue-900/30",     text: "text-blue-600 dark:text-blue-400",   border: "border-blue-200 dark:border-blue-800" },
  { key: "indigo",  label: "インディゴ",bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-600 dark:text-indigo-400",border: "border-indigo-200 dark:border-indigo-800" },
  { key: "purple",  label: "パープル",  bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400",border: "border-purple-200 dark:border-purple-800" },
  { key: "pink",    label: "ピンク",    bg: "bg-pink-100 dark:bg-pink-900/30",     text: "text-pink-600 dark:text-pink-400",   border: "border-pink-200 dark:border-pink-800" },
];
