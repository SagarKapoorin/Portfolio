import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border border-[#2f3340] bg-[#121421] p-4 text-sm leading-7 text-[#d8defa]">
      {children}
    </aside>
  );
}

