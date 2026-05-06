export function Mermaid({ code }: { code: string }) {
  return (
    <pre className="my-6 overflow-x-auto rounded-xl border border-[#23252a] bg-[#0b0c0d] p-4 text-sm leading-6 text-[#d0d6e0]">
      <code>{code}</code>
    </pre>
  );
}

