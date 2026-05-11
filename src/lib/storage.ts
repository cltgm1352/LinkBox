import { LinkItem } from "@/types/link";

const STORAGE_KEY = "linkbox_links";

export function loadLinks(): LinkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LinkItem[]) : [];
  } catch {
    return [];
  }
}

export function saveLinks(links: LinkItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}
