import { LinkItem, Category } from "@/types/link";

const LINKS_KEY = "linkbox_links";
const CATS_KEY  = "linkbox_categories";

export function loadLinks(): LinkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? (JSON.parse(raw) as LinkItem[]) : [];
  } catch { return []; }
}

export function saveLinks(links: LinkItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function loadCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CATS_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch { return []; }
}

export function saveCategories(cats: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATS_KEY, JSON.stringify(cats));
}
