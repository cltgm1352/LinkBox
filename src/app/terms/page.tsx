import Link from "next/link";
import Image from "next/image";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6 no-underline w-fit">
            <Image src="/icon.svg" alt="LinkBox" width={24} height={24} className="rounded-lg" />
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">LinkBox</span>
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">利用規約</h1>
          <p className="text-sm text-zinc-400">最終更新日：2025年1月1日</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第1条（適用）</h2>
            <p>本利用規約（以下「本規約」）は、LinkBox（以下「本サービス」）の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第2条（利用登録）</h2>
            <p>登録希望者が本規約に同意のうえ、所定の方法で利用登録を申請し、運営者がこれを承認することで利用登録が完了します。</p>
            <p className="mt-2">以下の場合、利用登録の申請を承認しないことがあります。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>虚偽の情報を申請した場合</li>
              <li>過去に本規約に違反したことがある場合</li>
              <li>その他、運営者が不適切と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第3条（禁止事項）</h2>
            <p>ユーザーは本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>サーバーへの過度な負荷をかける行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスを試みる行為</li>
              <li>他のユーザーの個人情報を収集する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第4条（サービスの提供停止等）</h2>
            <p>運営者は以下のいずれかに該当する場合、ユーザーへの事前通知なく本サービスの全部または一部の提供を停止または中断することができます。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>システムの保守点検または更新を行う場合</li>
              <li>地震・落雷・火災・停電などの不可抗力により提供が困難な場合</li>
              <li>その他、運営者が停止または中断を必要と判断した場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第5条（免責事項）</h2>
            <p>運営者は本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じたトラブルに関し一切責任を負いません。本サービスの利用により生じた損害について、運営者は一切の責任を負いません。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第6条（サービス内容の変更等）</h2>
            <p>運営者はユーザーへの事前通知なく、本サービスの内容を変更しまたは本サービスの提供を中止することができます。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第7条（利用規約の変更）</h2>
            <p>運営者は必要と判断した場合、ユーザーへの事前通知なく本規約を変更することができます。変更後の利用規約はサービス上に掲示された時点で効力を生じるものとします。</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">第8条（準拠法・裁判管轄）</h2>
            <p>本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <Link href="/privacy" className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors">
            プライバシーポリシーを見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
