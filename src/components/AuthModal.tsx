"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    setMode(defaultMode); setError(null); setSuccess(null); setEmail(""); setPassword("");
  }, [defaultMode, isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("メールアドレスまたはパスワードが正しくありません");
      } else {
        onClose();
      }
    } else {
      // 既存メール確認: signInWithOTP で存在チェックはできないため
      // signUp のエラーコードで判別
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already")) {
          setError("このメールアドレスは既に登録されています。ログインしてください。");
        } else {
          setError("登録に失敗しました: " + error.message);
        }
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // identities が空 = 既存ユーザー（Supabaseの仕様）
        setError("このメールアドレスは既に登録されています。ログインしてください。");
      } else {
        setSuccess("確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。");
      }
    }
    setLoading(false);
  };

  const handleGitHub = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {mode === "login" ? "ログイン" : "新規登録"}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {mode === "login" ? "ログインして無制限にリンクを保存" : "無料で無制限に使えます"}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          <button
            onClick={handleGitHub} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white border border-zinc-800 dark:border-zinc-600 disabled:opacity-50 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHubでログイン
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-xs text-zinc-400">または</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {success ? (
            <div className="py-4 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">{success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレス" required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード（6文字以上）" required minLength={6}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
              {error && <p className="text-xs text-red-500 dark:text-red-400 px-1">{error}</p>}
              <button
                type="submit" disabled={loading || !email || !password}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "処理中..." : mode === "login" ? "ログイン" : "アカウント作成"}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-zinc-400">
            {mode === "login" ? (
              <>アカウントをお持ちでない方は{" "}
                <button onClick={() => { setMode("register"); setError(null); }} className="text-indigo-500 hover:text-indigo-600 font-medium">新規登録</button>
              </>
            ) : (
              <>すでにアカウントをお持ちの方は{" "}
                <button onClick={() => { setMode("login"); setError(null); }} className="text-indigo-500 hover:text-indigo-600 font-medium">ログイン</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
