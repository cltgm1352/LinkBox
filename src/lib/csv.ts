import { LinkItem, Category } from "@/types/link";

// ── Export ──────────────────────────────────────────────
export function exportLinksToCSV(links: LinkItem[], categories: Category[]): string {
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const header = ["id", "url", "title", "favicon", "categoryName", "bookmarked", "createdAt"];
  const rows = links.map((l) => [
    l.id,
    l.url,
    `"${(l.title ?? "").replace(/"/g, '""')}"`,
    l.favicon ?? "",
    `"${(catMap[l.categoryId ?? ""] ?? "").replace(/"/g, '""')}"`,
    l.bookmarked ? "true" : "false",
    new Date(l.createdAt).toISOString(),
  ]);
  return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(csv: string, filename: string) {
  const bom = "\uFEFF"; // UTF-8 BOM for Excel
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import ──────────────────────────────────────────────
export interface ImportResult {
  links: Omit<LinkItem, "id" | "createdAt">[];
  newCategoryNames: string[];
  count: number;
  errors: string[];
}

export function parseLinksCSV(text: string): ImportResult {
  const errors: string[] = [];
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { links: [], newCategoryNames: [], count: 0, errors: ["データが空です"] };

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const urlIdx       = headers.indexOf("url");
  const titleIdx     = headers.indexOf("title");
  const faviconIdx   = headers.indexOf("favicon");
  const catIdx       = headers.indexOf("categoryname");
  const bookmarkIdx  = headers.indexOf("bookmarked");

  if (urlIdx === -1) return { links: [], newCategoryNames: [], count: 0, errors: ["URLカラムが見つかりません"] };

  const categoryNames = new Set<string>();
  const links: Omit<LinkItem, "id" | "createdAt">[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // CSV parse (handles quoted fields)
    const cols = parseCSVLine(line);
    const url = cols[urlIdx]?.trim();
    if (!url) { errors.push(`行${i + 1}: URLが空です`); continue; }

    const catName = catIdx !== -1 ? cols[catIdx]?.trim() : "";
    if (catName) categoryNames.add(catName);

    links.push({
      url,
      title: titleIdx !== -1 ? cols[titleIdx]?.trim() || url : url,
      favicon: faviconIdx !== -1 ? cols[faviconIdx]?.trim() || null : null,
      categoryId: catName ? `__import__${catName}` : null,
      bookmarked: bookmarkIdx !== -1 ? cols[bookmarkIdx]?.trim() === "true" : false,
    });
  }

  return { links, newCategoryNames: [...categoryNames], count: links.length, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === "," && !inQuote) {
      result.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}
