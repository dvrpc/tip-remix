import { useState } from "react";

export default function DetailsToggle({
  filter,
  setFilter,
  name,
  title,
  options,
  submit,
  multiple = false,
  deselect = false,
}) {
  const [open, setOpen] = useState(false);
  const closed = open
    ? "after:content-['×'] after:text-lg after:h-4 after:-translate-x-0.5"
    : "after:border-b-2 after:border-r-2 after:rotate-45 after:-translate-y-0.5";

  return (
    <details
      className="bg-stone-600 cursor-pointer relative rounded text-white z-10"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className={`${closed} after:leading-none after:h-2 after:w-2 after:shrink-0 after:grow-0 flex gap-2 items-center list-none p-2`}
      >
        {title}
      </summary>
      <div className="absolute border border-stone-800 h-60 min-w-[10rem] overflow-y-auto z-20">
        {options.map((value) => {
          const enabled = filter.includes(value);
          const bg = enabled ? "bg-stone-700" : "bg-stone-600";
          return (
            <label
              className={`${bg} cursor-pointer flex gap-2 hover:text-stone-300 items-center px-4 py-2 text-white`}
              key={value}
              onClick={(e) => {
                console.log(e);
                if (deselect && e.target.checked) {
                  setFilter([]);
                  submit && submit(e.target.form, { replace: true });
                }
              }}
            >
              <input
                className={`${
                  multiple ? "inline-block" : "hidden"
                } accent-stone-800 appearance-none bg-stone-600 border-2 border-stone-300 h-4 mr-1 outline-none p-0 pointer rounded shrink-0 text-stone-300 vertical-align-middle w-4`}
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={value}
                checked={enabled}
                onChange={(e) => {
                  if (multiple) {
                    const newFilter = [...filter];
                    enabled
                      ? delete newFilter[newFilter.indexOf(e.target.value)]
                      : newFilter.push(e.target.value);
                    setFilter(newFilter);
                  } else {
                    setFilter([e.target.value]);
                  }
                  submit && submit(e.target.form, { replace: true });
                }}
                onDoubleClick={(e) => {
                  if (multiple) {
                    setFilter([]);
                    submit && submit(e.target.form, { replace: true });
                  }
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
