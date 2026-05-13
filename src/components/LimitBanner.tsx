"use client";

const FREE_LIMIT = 50;

interface LimitBannerProps {
  count: number;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function LimitBanner({ count, onLoginClick, onRegisterClick }: LimitBannerProps) {
  const remaining = FREE_LIMIT - count;

  if (count < FREE_LIMIT * 0.75) return null; // 15件未満は非表示

  if (count >= FREE_LIMIT) {
    return (
      <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">上限（{FREE_LIMIT}件）に達しました</p>
        <p className="text-xs text-red-500 dark:text-red-400/80 mb-3">新しいリンクを追加するにはログインまたは新規登録が必要です。</p>
        <div className="flex gap-2">
          <button
            onClick={onRegisterClick}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            無料登録して続ける
          </button>
          <button
            onClick={onLoginClick}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center gap-3">
      <div className="shrink-0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          残り<strong className="font-semibold"> {remaining}件 </strong>で上限です。
          <button onClick={onRegisterClick} className="underline underline-offset-2 font-medium hover:text-amber-800 dark:hover:text-amber-300">登録</button>
          {" "}または{" "}
          <button onClick={onLoginClick} className="underline underline-offset-2 font-medium hover:text-amber-800 dark:hover:text-amber-300">ログイン</button>
          {" "}で無制限に。
        </p>
      </div>
    </div>
  );
}

export const FREE_LIMIT_CONST = FREE_LIMIT;
