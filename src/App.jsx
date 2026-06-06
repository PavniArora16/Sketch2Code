import { useState, useCallback } from "react";
import Canvas from "./components/Canvas";
import CodePanel from "./components/CodePanel";
import Toolbar from "./components/Toolbar";
import ComponentPicker from "./components/ComponentPicker";
import { generateCode } from "./utils/codeGen";
import { useStyleGen } from "./hooks/useStyleGen";

export default function App() {
  const [shapes, setShapes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [pendingShape, setPendingShape] = useState(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(8);

  const { generate, loading, error, styledCode, reset } = useStyleGen();

  const selectedShape = shapes.find((s) => s.id === selected) ?? null;
  const code = selectedShape ? generateCode(selectedShape) : null;

  const addShape = useCallback((shape) => {
    setPendingShape(shape);
  }, []);

  const labelShape = useCallback(
    (type) => {
      if (!pendingShape) return;
      const labeled = { ...pendingShape, type };
      setShapes((prev) => [...prev, labeled]);
      setSelected(labeled.id);
      setPendingShape(null);
      reset(); // clear any previous AI style when new shape selected
    },
    [pendingShape, reset]
  );

  const updateShape = useCallback((id, patch) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
    reset(); // reset AI style when shape resized
  }, [reset]);

  const deleteShape = useCallback(
    (id) => {
      setShapes((prev) => prev.filter((s) => s.id !== id));
      if (selected === id) setSelected(null);
      reset();
    },
    [selected, reset]
  );

  const handleSelect = useCallback((id) => {
    setSelected(id);
    reset(); // clear AI style when switching shapes
  }, [reset]);

  const handleStyleGenerate = useCallback(
    (stylePrompt) => {
      if (!selectedShape || !code) return;
      generate({
        baseCode: code.jsx,
        componentType: selectedShape.type,
        dimensions: { w: selectedShape.w, h: selectedShape.h },
        stylePrompt,
      });
    },
    [selectedShape, code, generate]
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f0f11] text-white font-mono overflow-hidden">
      <Toolbar
        snapToGrid={snapToGrid}
        onToggleSnap={() => setSnapToGrid((v) => !v)}
        onDeleteSelected={selected ? () => deleteShape(selected) : null}
      />

      <div className="flex flex-1 min-h-0">
        <Canvas
          shapes={shapes}
          selected={selected}
          onSelect={handleSelect}
          onAddShape={addShape}
          onUpdateShape={updateShape}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />

        <CodePanel
          code={code}
          shape={selectedShape}
          onStyleGenerate={handleStyleGenerate}
          styleLoading={loading}
          styledCode={styledCode}
          styleError={error}
          onStyleReset={reset}
        />
      </div>

      {pendingShape && (
        <ComponentPicker
          shape={pendingShape}
          onPick={labelShape}
          onCancel={() => setPendingShape(null)}
        />
      )}
    </div>
  );
}
