"use client";

import { useState, useEffect, useCallback } from "react";
import { LinkItem } from "@/types/link";
import { loadLinks, saveLinks } from "@/lib/storage";
import { fetchUrlMeta, extractDomain, getFaviconUrl } from "@/lib/metadata";

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLinks(loadLinks());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveLinks(links);
    }
  }, [links, isLoaded]);

  const addLink = useCallback(async (rawUrl: string): Promise<void> => {
    let url = rawUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const id = crypto.randomUUID();

    const optimistic: LinkItem = {
      id,
      url,
      title: extractDomain(url),
      favicon: getFaviconUrl(url),
      createdAt: Date.now(),
    };
    setLinks((prev) => [optimistic, ...prev]);

    const meta = await fetchUrlMeta(url);
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? {
              ...link,
              title: meta.title || extractDomain(url),
              favicon: meta.favicon || getFaviconUrl(url),
            }
          : link
      )
    );
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }, []);

  const updateLink = useCallback(async (id: string, rawUrl: string): Promise<void> => {
    let url = rawUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    // Optimistically update URL and reset meta
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? { ...link, url, title: extractDomain(url), favicon: getFaviconUrl(url) }
          : link
      )
    );

    const meta = await fetchUrlMeta(url);
    setLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? {
              ...link,
              title: meta.title || extractDomain(url),
              favicon: meta.favicon || getFaviconUrl(url),
            }
          : link
      )
    );
  }, []);

  return { links, addLink, removeLink, updateLink, isLoaded };
}
