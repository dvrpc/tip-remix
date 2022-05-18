import { useState } from "react";
import { togglableLayers } from "~/mapbox-layers";

export default function LayerPicker({ activeLayer, setActiveLayer }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="absolute bg-stone-600 cursor-default m-4 overflow-clip rounded text-white z-50"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="p-2">
        {togglableLayers[activeLayer]?.id || "Layers"}
      </summary>
      {Object.keys(togglableLayers).map((id) => {
          const bg = activeLayer === id ? "bg-stone-700" : "bg-stone-600";
        return (
          <label
            className={`cursor-pointer hover:bg-stone-700 hover:text-stone-300 ${bg} list-item px-4 py-2`}
            key={id}
          >
            <input
              type="radio"
              name="layers"
              value={id}
              className="hidden"
              checked={activeLayer === id}
              onClick={(e) => {
                if (activeLayer === (e.target as HTMLInputElement).value) {
                  setActiveLayer(null);
                  setOpen(false);
                }
              }}
              onChange={(e) => {
                setActiveLayer(e.target.value);
                setOpen(false);
              }}
            />
            {togglableLayers[id].id}
          </label>
        );
      })}
    </details>
  );
}
