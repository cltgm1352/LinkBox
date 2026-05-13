"use client";

import { useState, useEffect, useCallback } from "react";
import { LinkItem, Category } from "@/types/link";
import { loadLinks, saveLinks, loadCategories, saveCategories } from "@/lib/storage";
import { fetchUrlMeta, extractDomain, getFaviconUrl } from "@/lib/metadata";

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setLinks(loadLinks());
    setCategories(loadCategories());
    setIsLoaded(true);
  }, []);

  useEffect(() => { if (isLoaded) saveLinks(links); }, [links, isLoaded]);
  useEffect(() => { if (isLoaded) saveCategories(categories); }, [categories, isLoaded]);

  // ── Links ──
  const addLink = useCallback(async (rawUrl: string, categoryId?: string): Promise<void> => {
    let url = rawUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const id = crypto.randomUUID();
    const optimistic: LinkItem = {
      id, url, title: extractDomain(url),
      favicon: getFaviconUrl(url), createdAt: Date.now(),
      categoryId: categoryId ?? null, bookmarked: false,
    };
    setLinks((prev) => [optimistic, ...prev]);
    const meta = await fetchUrlMeta(url);
    setLinks((prev) => prev.map((l) => l.id === id
      ? { ...l, title: meta.title || extractDomain(url), favicon: meta.favicon || getFaviconUrl(url) }
      : l));
  }, []);

  const removeLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLink = useCallback(async (id: string, patch: { url?: string; title?: string }): Promise<void> => {
    if (patch.url) {
      let url = patch.url.trim();
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;
      setLinks((prev) => prev.map((l) => l.id === id
        ? { ...l, url, title: patch.title ?? extractDomain(url), favicon: getFaviconUrl(url) }
        : l));
      const meta = await fetchUrlMeta(url);
      setLinks((prev) => prev.map((l) => l.id === id
        ? { ...l, title: patch.title || meta.title || extractDomain(url), favicon: meta.favicon || getFaviconUrl(url) }
        : l));
    } else if (patch.title !== undefined) {
      setLinks((prev) => prev.map((l) => l.id === id ? { ...l, title: patch.title! } : l));
    }
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, bookmarked: !l.bookmarked } : l));
  }, []);

  const setLinkCategory = useCallback((id: string, categoryId: string | null) => {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, categoryId } : l));
  }, []);

  // ── Categories ──
  const addCategory = useCallback((name: string, icon: string, color: string): Category => {
    const cat: Category = { id: crypto.randomUUID(), name, icon, color, createdAt: Date.now() };
    setCategories((prev) => [...prev, cat]);
    return cat;
  }, []);

  const updateCategory = useCallback((id: string, patch: Partial<Pick<Category, "name" | "icon" | "color">>) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setLinks((prev) => prev.map((l) => l.categoryId === id ? { ...l, categoryId: null } : l));
  }, []);

  const importLinks = useCallback((
    incoming: Omit<LinkItem, "id" | "createdAt">[],
    newCategoryNames: string[]
  ) => {
    // Create new categories
    const newCats: Category[] = newCategoryNames.map((name) => ({
      id: crypto.randomUUID(),
      name,
      icon: "📁",
      color: "indigo",
      createdAt: Date.now(),
    }));
    if (newCats.length > 0) {
      setCategories((prev) => [...prev, ...newCats]);
    }

    // Build a name→id map for new cats
    const nameToId = Object.fromEntries(newCats.map((c) => [c.name, c.id]));

    const newLinks: LinkItem[] = incoming.map((l) => {
      let categoryId = l.categoryId ?? null;
      if (categoryId?.startsWith("__import__")) {
        const name = categoryId.replace("__import__", "");
        categoryId = nameToId[name] ?? null;
      }
      return { ...l, id: crypto.randomUUID(), createdAt: Date.now(), categoryId };
    });

    setLinks((prev) => [...newLinks, ...prev]);
  }, []);


  return {
    links, categories, isLoaded,
    addLink, removeLink, updateLink, toggleBookmark, setLinkCategory,
    addCategory, updateCategory, removeCategory, importLinks,
  };
}
