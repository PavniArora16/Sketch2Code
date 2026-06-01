const COMPONENTS = [
  { type: "button", label: "Button", icon: "⬜", color: "blue" },
  { type: "input", label: "Input", icon: "✏️", color: "violet" },
  { type: "card", label: "Card", icon: "🃏", color: "emerald" },
  { type: "navbar", label: "Navbar", icon: "🔝", color: "amber" },
];

const COLOR_MAP = {
  blue: "border-blue-500 hover:bg-blue-500/10 text-blue-400",
  violet: "border-violet-500 hover:bg-violet-500/10 text-violet-400",
  emerald: "border-emerald-500 hover:bg-emerald-500/10 text-emerald-400",
  amber: "border-amber-500 hover:bg-amber-500/10 text-amber-400",
};

export default function ComponentPicker({ shape, onPick, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1f] border border-white/10 rounded-2xl p-6 w-[360px] shadow-2xl">
        <div className="mb-4">
          <h2 className="text-white font-semibold text-sm tracking-widest uppercase mb-1">
            Label Component
          </h2>
          <p className="text-white/40 text-xs">
            {shape.w}×{shape.h}px — what are you drawing?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {COMPONENTS.map((c) => (
            <button
              key={c.type}
              onClick={() => onPick(c.type)}
              className={`border rounded-xl p-4 text-left transition-all ${COLOR_MAP[c.color]} border-opacity-50`}
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="font-semibold text-sm">{c.label}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="mt-4 w-full text-xs text-white/30 hover:text-white/60 transition-colors py-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
