"use client";

import { useEffect, useRef } from "react";

export function AdBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !ref.current) return;
    loaded.current = true;

    const script = document.createElement("script");
    script.src = "https://adm.shinobi.jp/o/2cee7680df7bd66dd4bd7dda0d09f0d4";
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      <div
        ref={ref}
        className="max-w-full overflow-hidden rounded-xl"
      />
    </div>
  );
}
