export interface UrlMeta {
  title: string;
  favicon: string | null;
}

export async function fetchUrlMeta(url: string): Promise<UrlMeta> {
  try {
    const response = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
    if (!response.ok) throw new Error("Failed");
    const data = await response.json();
    return {
      title: data.title || extractDomain(url),
      favicon: data.favicon || null,
    };
  } catch {
    return {
      title: extractDomain(url),
      favicon: null,
    };
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const { protocol, hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${protocol}//${hostname}&sz=64`;
  } catch {
    return "";
  }
}
