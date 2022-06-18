import { togglableLayers } from "~/mapbox-layers";
import { categories } from "~/utils";

export default function Legend({ activeLayer }: { activeLayer: string }) {
  const source = activeLayer
    ? togglableLayers.find((l) => l.id === activeLayer)
    : undefined;

  return (
    <div className="absolute bg-stone-600/90 bottom-0 cursor-default m-5 max-w-full overflow-clip p-4 rounded text-white z-10">
      {source && source.layer.legend ? (
        <div className="border-b border-stone-700/90 flex gap-4 justify-between mb-4 pb-4">
          <h3 className="font-bold text-sm">{source.id}</h3>
          {source.link && (
            <a
              className="inherit italic mr-auto underline"
              href={source.link}
              target="_blank"
            >
              More Info
            </a>
          )}
          <div
            className={`flex flex-row flex-wrap ${
              source.layer.continuous ? "" : "gap-x-4 gap-y-2"
            } justify-end`}
          >
            {source.layer.legend.map(([color, value], i) => (
              <div
                key={i}
                className="border-b-8 min-w-[2rem]"
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
