import { useState } from "react";

export default function DetailsCheckbox({
  filter,
  setFilter,
  name,
  title,
  options,
  submit,
}) {
  const [open, setOpen] = useState(false);
  const closed = open
    ? "after:content-['×'] after:text-xl after:ml-1 after:-mt-1"
    : "after:border-b-2 after:border-r-2 after:rotate-45 after:mt-2";

  return (
    <details
      className="bg-stone-600 cursor-pointer relative rounded text-white z-10"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className={`${closed} after:absolute after:h-2 after:inline-block after:ml-2 after:w-2 list-none p-2 pr-6 relative`}
      >
        {title}
      </summary>
      <div className="absolute border border-stone-800 h-60 overflow-y-auto z-10">
        {options.map((value) => {
          const enabled = filter.includes(value);
          const bg = enabled ? "bg-stone-700" : "bg-stone-600";
          return (
            <label
              className={`${bg} cursor-pointer flex gap-2 hover:text-stone-300 items-center px-4 py-2 text-white`}
              key={value}
            >
              <input
                className="accent-stone-800 appearance-none bg-stone-600 border-2 border-stone-300 h-4 inline-block mr-1 outline-none p-0 pointer rounded text-stone-300 vertical-align-middle w-4"
                type="checkbox"
                name={name}
                value={value}
                checked={enabled}
                onChange={(e) => {
                  const newFilter = [...filter];
                  enabled
                    ? delete newFilter[newFilter.indexOf(e.target.value)]
                    : newFilter.push(e.target.value);
                  setFilter(newFilter);
                  submit(e.target.form, { replace: true });
                }}
                onDoubleClick={(e) => {
                  setFilter([]);
                  submit(e.target.form, { replace: true });
                }}
              />
              <span>{value}</span>
            </label>
          );
        })}
      </div>
    </details>
  );
}
