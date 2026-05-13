import Link from "next/link";
import Image from "next/image";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6 no-underline w-fit">
            <Image src="/icon.svg" alt="LinkBox" width={24} height={24} className="rounded-lg" />
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">LinkBox</span>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">プライバシーポリシー</h1>
          <p className="text-sm text-zinc-400">最終更新日：2026年5月13日</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第1条（個人情報の定義）</h2>
            <p>「個人情報」とは、個人情報保護法にいう「個人情報」を指し、生存する個人に関する情報であって、氏名・メールアドレス等により特定の個人を識別できるものをいいます。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第2条（収集する情報）</h2>
            <p>本サービスでは以下の情報を収集します。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>メールアドレス（アカウント登録時）</li>
              <li>GitHubアカウント情報（GitHub連携ログイン時）</li>
              <li>保存したURLおよびサイト情報</li>
              <li>サービス利用状況（アクセスログ等）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第3条（個人情報の利用目的）</h2>
            <p>収集した個人情報は以下の目的に使用します。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>本サービスの提供・運営</li>
              <li>ユーザー認証・アカウント管理</li>
              <li>利用規約違反への対応</li>
              <li>サービス改善・新機能開発</li>
              <li>お問い合わせへの対応</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第4条（第三者提供）</h2>
            <p>運営者は以下の場合を除き、個人情報を第三者に提供しません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第5条（利用するサービス）</h2>
            <p>本サービスは以下の外部サービスを利用しています。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase</strong>（認証・データベース）— <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">プライバシーポリシー</a></li>
              <li><strong>Vercel</strong>（ホスティング）— <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">プライバシーポリシー</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第6条（データの保存）</h2>
            <p>ログインしていない場合、データはお使いのデバイスのLocalStorageにのみ保存されます。アカウント登録・ログイン後はSupabaseのデータベースに保存されます。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第7条（個人情報の開示・訂正・削除）</h2>
            <p>ユーザーは自身の個人情報の開示・訂正・削除を請求できます。アカウント削除によりすべての個人情報および保存データが削除されます。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第8条（お問い合わせ）</h2>
            <p>本ポリシーに関するお問い合わせは、本サービスのお問い合わせ窓口までご連絡ください。</p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/terms" className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors">
            利用規約を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
