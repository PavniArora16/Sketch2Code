import { useState } from "react";
import StylePrompt from "./StylePrompt";

const BASE_TABS = ["jsx", "tailwind", "css"];

export default function CodePanel({ code, shape, onStyleGenerate, styleLoading, styledCode, styleError, onStyleReset }) {
  const [tab, setTab] = useState("jsx");
  const [viewMode, setViewMode] = useState("base"); // "base" | "ai"
  const [copied, setCopied] = useState(false);

  const effectiveMode = styledCode ? viewMode : "base";

  // In AI mode, show the AI version of the current tab
  const content =
    effectiveMode === "ai" && styledCode
      ? styledCode[tab] ?? ""
      : code?.[tab] ?? null;

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const handleStyleGenerate = (prompt) => {
    setViewMode("ai");
    onStyleGenerate(prompt);
  };

  const handleReset = () => {
    setViewMode("base");
    onStyleReset();
  };

  return (
    <div className="w-[380px] flex-shrink-0 flex flex-col border-l border-white/8 bg-[#13131a]">
      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-xs tracking-widest uppercase">
            Code Output
          </span>
          <div className="flex items-center gap-2">
            {shape?.type && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                {shape.w}×{shape.h}px
              </span>
            )}
            {styledCode && (
              <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                <button
                  onClick={() => setViewMode("base")}
                  className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${
                    effectiveMode === "base" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  Base
                </button>
                <button
                  onClick={() => setViewMode("ai")}
                  className={`text-[10px] px-2 py-0.5 rounded-md transition-all ${
                    effectiveMode === "ai" ? "bg-violet-500/30 text-violet-300" : "text-white/30 hover:text-white/60"
                  }`}
                >
                  ✦ AI
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs — always visible, switch between base/AI content */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {BASE_TABS.map((t) => (
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
          {effectiveMode === "ai" && (
            <button
              onClick={handleReset}
              className="text-[10px] text-white/20 hover:text-white/50 transition-colors pb-1"
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {/* Code area */}
      <div className={`flex-1 border border-white/8 mx-4 rounded-b-xl rounded-tr-xl overflow-hidden flex flex-col min-h-0 ${
        effectiveMode === "ai" ? "bg-[#1a1a2e]" : "bg-[#1e1e2a]"
      }`}>
        {styleLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-violet-400/60">
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-xs">Generating style...</span>
          </div>
        ) : styleError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="text-2xl">⚠️</div>
            <p className="text-xs text-red-400/80">{styleError}</p>
            <button onClick={handleReset} className="text-[10px] text-white/30 hover:text-white/60">
              Go back
            </button>
          </div>
        ) : content ? (
          <>
            {effectiveMode === "ai" && (
              <div className="px-4 pt-3 pb-1">
                <span className="text-[10px] text-violet-400/60">✦ AI styled · {tab}</span>
              </div>
            )}
            <pre className={`flex-1 overflow-auto p-4 text-xs leading-relaxed font-mono whitespace-pre-wrap ${
              effectiveMode === "ai" ? "text-violet-300" : "text-emerald-300"
            }`}>
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

      <StylePrompt
        onGenerate={handleStyleGenerate}
        loading={styleLoading}
        disabled={!shape?.type}
      />
    </div>
  );
}
