import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "LinkBox",
  description: "よく使うURLにすぐアクセスできる個人向けリンク管理アプリ",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/favicon-57.png",              sizes: "57x57" },
      { url: "/favicon/favicon-72-precomposed.png",  sizes: "72x72" },
      { url: "/favicon/favicon-114-precomposed.png", sizes: "114x114" },
      { url: "/favicon/favicon-120-precomposed.png", sizes: "120x120" },
      { url: "/favicon/favicon-144-precomposed.png", sizes: "144x144" },
      { url: "/favicon/favicon-152-precomposed.png", sizes: "152x152" },
      { url: "/favicon/favicon-180-precomposed.png", sizes: "180x180" },
    ],
    other: [
      { rel: "apple-touch-icon", url: "/favicon/favicon-76.png", sizes: "76x76" },
      { rel: "apple-touch-icon", url: "/favicon/favicon-60.png", sizes: "60x60" },
    ],
  },
  other: {
    "msapplication-TileColor": "#6366f1",
    "msapplication-TileImage": "/favicon/favicon-144-precomposed.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,       // ズーム禁止
  userScalable: false,   // ピンチズーム無効
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
