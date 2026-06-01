import { useRef, useState, useEffect, useCallback } from "react";

const HANDLE_SIZE = 8;
const MIN_SIZE = 20;

const COMPONENT_COLORS = {
  button: { fill: "#3b82f620", stroke: "#3b82f6" },
  input: { fill: "#8b5cf620", stroke: "#8b5cf6" },
  card: { fill: "#10b98120", stroke: "#10b981" },
  navbar: { fill: "#f59e0b20", stroke: "#f59e0b" },
  default: { fill: "#ffffff10", stroke: "#ffffff40" },
};

function snap(value, grid, enabled) {
  return enabled ? Math.round(value / grid) * grid : value;
}

function getHandles(shape) {
  const { x, y, w, h } = shape;
  return [
    { id: "nw", cx: x, cy: y },
    { id: "ne", cx: x + w, cy: y },
    { id: "sw", cx: x, cy: y + h },
    { id: "se", cx: x + w, cy: y + h },
    { id: "n", cx: x + w / 2, cy: y },
    { id: "s", cx: x + w / 2, cy: y + h },
    { id: "e", cx: x + w, cy: y + h / 2 },
    { id: "w", cx: x, cy: y + h / 2 },
  ];
}

function hitHandle(mx, my, shape) {
  for (const h of getHandles(shape)) {
    if (Math.abs(mx - h.cx) <= HANDLE_SIZE && Math.abs(my - h.cy) <= HANDLE_SIZE)
      return h.id;
  }
  return null;
}

function hitShape(mx, my, shape) {
  return (
    mx >= shape.x &&
    mx <= shape.x + shape.w &&
    my >= shape.y &&
    my <= shape.y + shape.h
  );
}

function resizeShape(shape, handle, dx, dy) {
  let { x, y, w, h } = shape;
  if (handle.includes("e")) w = Math.max(MIN_SIZE, w + dx);
  if (handle.includes("s")) h = Math.max(MIN_SIZE, h + dy);
  if (handle.includes("w")) { x += dx; w = Math.max(MIN_SIZE, w - dx); }
  if (handle.includes("n")) { y += dy; h = Math.max(MIN_SIZE, h - dy); }
  return { x, y, w, h };
}

export default function Canvas({
  shapes,
  selected,
  onSelect,
  onAddShape,
  onUpdateShape,
  snapToGrid,
  gridSize,
}) {
  const svgRef = useRef(null);
  const [drawing, setDrawing] = useState(null); // { startX, startY, x, y, w, h }
  const [dragging, setDragging] = useState(null); // { id, startX, startY, origX, origY }
  const [resizing, setResizing] = useState(null); // { id, handle, startX, startY, orig }
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setCanvasSize({ w: rect.width, h: rect.height });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toSVG = useCallback(
    (e) => {
      const rect = svgRef.current.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    []
  );

  const onMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      const { x, y } = toSVG(e);

      // Check resize handles on selected shape first
      if (selected) {
        const sel = shapes.find((s) => s.id === selected);
        if (sel) {
          const handle = hitHandle(x, y, sel);
          if (handle) {
            setResizing({ id: sel.id, handle, startX: x, startY: y, orig: { ...sel } });
            return;
          }
        }
      }

      // Check shape hit
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (hitShape(x, y, shapes[i])) {
          onSelect(shapes[i].id);
          setDragging({
            id: shapes[i].id,
            startX: x,
            startY: y,
            origX: shapes[i].x,
            origY: shapes[i].y,
          });
          return;
        }
      }

      // Start drawing
      onSelect(null);
      const sx = snap(x, gridSize, snapToGrid);
      const sy = snap(y, gridSize, snapToGrid);
      setDrawing({ startX: sx, startY: sy, x: sx, y: sy, w: 0, h: 0 });
    },
    [shapes, selected, onSelect, toSVG, snapToGrid, gridSize]
  );

  const onMouseMove = useCallback(
    (e) => {
      const { x, y } = toSVG(e);

      if (drawing) {
        const cx = snap(x, gridSize, snapToGrid);
        const cy = snap(y, gridSize, snapToGrid);
        const rx = Math.min(drawing.startX, cx);
        const ry = Math.min(drawing.startY, cy);
        const rw = Math.abs(cx - drawing.startX);
        const rh = Math.abs(cy - drawing.startY);
        setDrawing((d) => ({ ...d, x: rx, y: ry, w: rw, h: rh }));
        return;
      }

      if (dragging) {
        const dx = x - dragging.startX;
        const dy = y - dragging.startY;
        const nx = snap(dragging.origX + dx, gridSize, snapToGrid);
        const ny = snap(dragging.origY + dy, gridSize, snapToGrid);
        onUpdateShape(dragging.id, { x: nx, y: ny });
        return;
      }

      if (resizing) {
        const dx = x - resizing.startX;
        const dy = y - resizing.startY;
        const updated = resizeShape(resizing.orig, resizing.handle, dx, dy);
        const snapped = {
          x: snap(updated.x, gridSize, snapToGrid),
          y: snap(updated.y, gridSize, snapToGrid),
          w: snap(updated.w, gridSize, snapToGrid),
          h: snap(updated.h, gridSize, snapToGrid),
        };
        onUpdateShape(resizing.id, snapped);
      }
    },
    [drawing, dragging, resizing, toSVG, snapToGrid, gridSize, onUpdateShape]
  );

  const onMouseUp = useCallback(
    (e) => {
      if (drawing) {
        const { x, y, w, h } = drawing;
        if (w > MIN_SIZE && h > MIN_SIZE) {
          onAddShape({
            id: crypto.randomUUID(),
            x,
            y,
            w,
            h,
            type: null,
          });
        }
        setDrawing(null);
        return;
      }
      setDragging(null);
      setResizing(null);
    },
    [drawing, onAddShape]
  );

  const selectedShape = shapes.find((s) => s.id === selected);

  // Grid dots
  const gridDots = [];
  const step = gridSize * 2;
  for (let gx = 0; gx <= canvasSize.w; gx += step) {
    for (let gy = 0; gy <= canvasSize.h; gy += step) {
      gridDots.push(<circle key={`${gx}-${gy}`} cx={gx} cy={gy} r={0.8} fill="#ffffff18" />);
    }
  }

  return (
    <svg
      ref={svgRef}
      className="flex-1 min-w-0 cursor-crosshair select-none"
      style={{ background: "#0f0f11" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Grid */}
      {gridDots}

      {/* Shapes */}
      {shapes.map((shape) => {
        const colors = COMPONENT_COLORS[shape.type] ?? COMPONENT_COLORS.default;
        const isSelected = shape.id === selected;
        return (
          <g key={shape.id}>
            <rect
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              fill={colors.fill}
              stroke={isSelected ? colors.stroke : colors.stroke + "88"}
              strokeWidth={isSelected ? 1.5 : 1}
              rx={4}
            />
            {/* Label */}
            {shape.type && (
              <text
                x={shape.x + 6}
                y={shape.y + 14}
                fontSize={10}
                fill={colors.stroke}
                className="pointer-events-none"
                style={{ fontFamily: "monospace" }}
              >
                {shape.type}
              </text>
            )}
            {/* Dimension badge */}
            {isSelected && (
              <text
                x={shape.x + shape.w / 2}
                y={shape.y - 6}
                fontSize={9}
                fill="#ffffff80"
                textAnchor="middle"
                className="pointer-events-none"
                style={{ fontFamily: "monospace" }}
              >
                {shape.w}×{shape.h}
              </text>
            )}
            {/* Resize handles */}
            {isSelected &&
              getHandles(shape).map((h) => (
                <rect
                  key={h.id}
                  x={h.cx - HANDLE_SIZE / 2}
                  y={h.cy - HANDLE_SIZE / 2}
                  width={HANDLE_SIZE}
                  height={HANDLE_SIZE}
                  fill="#0f0f11"
                  stroke={colors.stroke}
                  strokeWidth={1.5}
                  rx={1}
                  className="cursor-nwse-resize"
                />
              ))}
          </g>
        );
      })}

      {/* Ghost while drawing */}
      {drawing && drawing.w > 2 && drawing.h > 2 && (
        <rect
          x={drawing.x}
          y={drawing.y}
          width={drawing.w}
          height={drawing.h}
          fill="#ffffff08"
          stroke="#ffffff50"
          strokeWidth={1}
          strokeDasharray="4 3"
          rx={4}
        />
      )}
    </svg>
  );
}
