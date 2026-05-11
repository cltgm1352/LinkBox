import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkBox/1.0)",
      },
    });
    clearTimeout(timeout);

    const html = await res.text();

    // Extract title
    const titleMatch = html.match(
      /<title[^>]*>([^<]{1,200})<\/title>/i
    );
    const ogTitleMatch = html.match(
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{1,200})["']/i
    ) || html.match(
      /<meta[^>]+content=["']([^"']{1,200})["'][^>]+property=["']og:title["']/i
    );

    const title = (ogTitleMatch?.[1] || titleMatch?.[1] || "").trim();

    // Build favicon URL via Google's service (reliable cross-origin)
    const { protocol, hostname } = new URL(url);
    const favicon = `https://www.google.com/s2/favicons?domain=${protocol}//${hostname}&sz=64`;

    return NextResponse.json({ title, favicon });
  } catch {
    // Fallback: just return google favicon service
    try {
      const { protocol, hostname } = new URL(url);
      const favicon = `https://www.google.com/s2/favicons?domain=${protocol}//${hostname}&sz=64`;
      return NextResponse.json({ title: "", favicon });
    } catch {
      return NextResponse.json({ title: "", favicon: null });
    }
  }
}
