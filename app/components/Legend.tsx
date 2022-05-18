import { togglableLayers } from "~/mapbox-layers";
import { categories } from "~/utils";

export default function Legend({ activeLayer }) {
  const legend = togglableLayers[activeLayer]?.layer.legend;

  return (
    <div className="absolute bg-stone-600/90 bottom-0 cursor-default m-4 max-w-full overflow-clip p-4 rounded text-white z-50">
      {legend ? (
        <div className="flex gap-4 justify-between mb-4 border-b border-stone-700/90 pb-4">
          <h3 className="font-bold text-sm">
            {togglableLayers[activeLayer]?.id}
          </h3>
          <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 justify-end">
            {legend.map(([color, value]) => (
              <div
                key={value}
                className="border-b-8"
                style={{ borderColor: color }}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div className="flex gap-4 justify-between">
        <h3 className="font-bold text-sm">Categories</h3>
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 justify-end">
          {Object.keys(categories)
            .sort()
            .map((key) => {
              return key !== "null" ? (
                <div
                  key={key}
                  className="border-b-8"
                  style={{ borderColor: categories[key] }}
                >
                  {key}
                </div>
              ) : null;
            })}
        </div>
      </div>
    </div>
  );
}
