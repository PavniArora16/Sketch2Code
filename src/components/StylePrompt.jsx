import { useState } from "react";

const SUGGESTIONS = [
  "dark SaaS",
  "fintech app",
  "glassmorphism",
  "brutalist",
  "soft pastel",
  "neon cyberpunk",
  "minimal Apple-style",
  "warm startup",
];

export default function StylePrompt({ onGenerate, loading, disabled }) {
  const [prompt, setPrompt] = useState("");

  const submit = () => {
    if (!prompt.trim() || loading || disabled) return;
    onGenerate(prompt.trim());
  };

  const pick = (s) => {
    setPrompt(s);
  };

  return (
    <div className="border-t border-white/8 p-4 space-y-3">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        <span className="text-[10px] text-white/40 tracking-widest uppercase">
          AI Style Generator
        </span>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder='e.g. "dark SaaS" or "fintech app"'
          disabled={disabled || loading}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-500/60 disabled:opacity-40 transition-colors"
        />
        <button
          onClick={submit}
          disabled={!prompt.trim() || loading || disabled}
          className="px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all flex items-center gap-1.5 min-w-[72px] justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Gen...
            </>
          ) : (
            <>✦ Style</>
          )}
        </button>
      </div>

      {/* Suggestion chips */}
      {!disabled && (
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => pick(s)}
              className={`text-[10px] px-2 py-1 rounded-md border transition-all ${
                prompt === s
                  ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                  : "border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {disabled && (
        <p className="text-[10px] text-white/20">
          Select a labeled component first to use AI styling.
        </p>
      )}
    </div>
  );
}
