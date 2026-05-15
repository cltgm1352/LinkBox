"use client";

import { useEffect, useRef, useState } from "react";

export function AdBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 少し遅らせてレンダリング後に挿入（SSRエラー回避）
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show || loaded.current || !ref.current) return;
    loaded.current = true;

    // コンテナをクリアしてからscriptを追加
    ref.current.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://adm.shinobi.jp/o/2cee7680df7bd66dd4bd7dda0d09f0d4";
    script.type = "text/javascript";
    ref.current.appendChild(script);
  }, [show]);

  if (!show) return null;

  return (
    <div className="w-full flex justify-center items-center my-3">
      <div
        ref={ref}
        className="max-w-full overflow-hidden"
      />
    </div>
  );
}
