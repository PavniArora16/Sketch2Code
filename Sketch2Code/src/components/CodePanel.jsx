import { useState } from "react";

const TABS = ["jsx", "tailwind", "css"];

export default function CodePanel({ code, shape }) {
  const [tab, setTab] = useState("jsx");
  const [copied, setCopied] = useState(false);

  const content = code?.[tab] ?? null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="w-[360px] flex-shrink-0 flex flex-col border-l border-white/8 bg-[#13131a]">
      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-widest uppercase">
            Code Output
          </span>
          {shape?.type && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
              {shape.w}×{shape.h}px
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-t-md transition-all font-mono ${
                tab === t
                  ? "bg-[#1e1e2a] text-white border border-white/10 border-b-[#1e1e2a]"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 bg-[#1e1e2a] border border-white/8 mx-4 rounded-b-xl rounded-tr-xl overflow-hidden flex flex-col min-h-0">
        {content ? (
          <>
            <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-emerald-300 font-mono whitespace-pre-wrap">
              {content}
            </pre>
            <div className="border-t border-white/8 p-3">
              <button
                onClick={handleCopy}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy to clipboard"}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/20 text-xs text-center p-6 gap-3">
            <div className="text-4xl opacity-30">✏️</div>
            <p>Draw a rectangle on the canvas,<br />then label it to see generated code.</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="p-4 space-y-1.5 text-[10px] text-white/20">
        <p>• Drag on canvas to draw a shape</p>
        <p>• Drag corners to resize</p>
        <p>• Click to select · Delete key removes</p>
      </div>
    </div>
  );
}
