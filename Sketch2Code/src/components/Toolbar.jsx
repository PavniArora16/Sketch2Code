export default function Toolbar({ snapToGrid, onToggleSnap, onDeleteSelected }) {
  return (
    <div className="h-12 border-b border-white/8 bg-[#13131a] flex items-center px-4 gap-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold">
          S
        </div>
        <span className="text-white font-semibold text-sm tracking-tight">
          Sketch<span className="text-violet-400">2</span>Code
        </span>
        <span className="text-white/20 text-[10px] ml-1 border border-white/10 px-1.5 py-0.5 rounded">
          v1
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-white/10" />

      {/* Tool: Draw (always active in v1) */}
      <button className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-white/10 text-white border border-white/15">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        Draw
      </button>

      {/* Snap to grid toggle */}
      <button
        onClick={onToggleSnap}
        className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-all ${
          snapToGrid
            ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
            : "text-white/40 border-white/10 hover:text-white/60"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="2" cy="2" r="1" fill="currentColor"/>
          <circle cx="6" cy="2" r="1" fill="currentColor"/>
          <circle cx="10" cy="2" r="1" fill="currentColor"/>
          <circle cx="2" cy="6" r="1" fill="currentColor"/>
          <circle cx="6" cy="6" r="1" fill="currentColor"/>
          <circle cx="10" cy="6" r="1" fill="currentColor"/>
          <circle cx="2" cy="10" r="1" fill="currentColor"/>
          <circle cx="6" cy="10" r="1" fill="currentColor"/>
          <circle cx="10" cy="10" r="1" fill="currentColor"/>
        </svg>
        Snap {snapToGrid ? "ON" : "OFF"}
      </button>

      {/* Delete */}
      {onDeleteSelected && (
        <button
          onClick={onDeleteSelected}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all ml-auto"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 3h10M4 3V2h4v1M3 3l.5 7h5L9 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Delete
        </button>
      )}
    </div>
  );
}
