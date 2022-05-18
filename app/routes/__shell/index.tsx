import { useState } from "react";
import {
  Form,
  Link,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import { sortByProperty } from "~/utils";
import DetailsCheckbox from "~/components/DetailsCheckbox";
import CategoryIcon, {
  links as categoryIconLinks,
} from "~/components/CategoryIcon";

export const links = () => {
  return categoryIconLinks();
};

export default function Panel() {
  const {
    keyword,
    transition,
    projects,
    funds,
    setHoverProject,
    sortState,
    categoryFilterState,
    aqcodeFilterState,
    fundFilterState,
    mrpFilterState,
    location,
  } = useOutletContext();
  const [sortKey, setSortKey] = sortState;
  const [categoryFilter, setCategoryFilter] = categoryFilterState;
  const [aqcodeFilter, setAqcodeFilter] = aqcodeFilterState;
  const [fundFilter, setFundFilter] = fundFilterState;
  const [mrpFilter, setMrpFilter] = mrpFilterState;
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <article
      className="flex flex-col max-h-full"
      style={{ colorScheme: "dark" }}
    >
      <Form className="m-8 mb-0">
        <div className="flex flex-row gap-2">
          <input
            type="search"
            name="keyword"
            placeholder="Search by keyword or MPMS"
            defaultValue={keyword}
            onChange={(e) =>
              e.target.value.length || navigate("", { keyword: null })
            }
            className="appearance-none bg-stone-600 flex-1 p-2 placeholder:text-stone-300 rounded shadow-[inset_0_0_0_1000px] shadow-stone-600 w-full"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 px-2 py-2 rounded text-stone-900"
          >
            {transition.submission ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="flex flex-row gap-2 justify-between my-4">
          <SortPicker
            sortKey={sortKey}
            setSortKey={setSortKey}
            submit={submit}
          />
          <DetailsCheckbox
            filter={categoryFilter}
            setFilter={setCategoryFilter}
            options={[
              "",
              "Bicycle/Pedestrian Improvement",
              "Bridge Repair/Replacement",
              "Streetscape",
              "Transit Improvements",
              "Signal/ITS Improvements",
              "Roadway Rehabilitation",
              "Roadway New Capacity",
              "Intersection/Interchange Improvements",
              "Other",
            ]}
            title="Category"
            name="categories"
            submit={submit}
          />
          <DetailsCheckbox
            filter={aqcodeFilter}
            setFilter={setAqcodeFilter}
            options={[...new Set(projects.map((p) => p.aq_code))].sort()}
            title="AQ Code"
            name="aqcodes"
            submit={submit}
          />
          <DetailsCheckbox
            filter={fundFilter}
            setFilter={setFundFilter}
            options={[...new Set(funds.map((f) => f.code))].sort()}
            title="Fund"
            name="funds"
            submit={submit}
          />
          <DetailsCheckbox
            filter={mrpFilter}
            setFilter={setMrpFilter}
            title="MRP"
            name="lrpids"
            options={[...new Set(projects.map((p) => p.mrp))].sort()}
            submit={submit}
          />
        </div>
      </Form>
      <ul className="flex flex-col mt-4 overflow-auto p-8 pt-0">
        {projects?.sort(sortByProperty(sortKey, true)).map((p) => (
          <li
            className="flex flex-nowrap flex-row hover:bg-stone-700 hover:underline items-stretch"
            key={p.id}
            id={p.id}
            data-p={JSON.stringify(p)}
            onMouseEnter={(e) => setHoverProject(e.target.id)}
            onMouseLeave={() => setHoverProject(null)}
          >
            <div className="border-b border-stone-400 flex flex-1 items-center">
              <Link
                to={{ pathname: p.id.toString(), search: location.search }}
                className="flex gap-4 items-center"
              >
                <CategoryIcon categoryName={p.category} />
                <strong>{p.id}</strong>
                <span className="leading-tight">{p.road_name}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h3>Error on page:</h3>
      <pre>{JSON.stringify(error)}</pre>
    </div>
  );
}

function SortPicker({ sortKey, setSortKey, submit }) {
  const [open, setOpen] = useState(false);
  const closed = open
    ? "after:content-['×'] after:text-xl after:ml-1 after:-mt-1"
    : "after:border-b-2 after:border-r-2 after:rotate-45 after:mt-2";

  const options = {
    id: "ID",
    road_name: "Name",
    category: "Category",
  };

  return (
    <details
      className="bg-stone-600 cursor-pointer relative rounded text-white z-10"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className={`${closed} after:absolute after:h-2 after:inline-block after:ml-2 after:w-2 list-none p-2 pr-6 relative`}
      >
        Sort
      </summary>
      <div className="absolute border border-stone-800 flex flex-col z-10">
        {Object.keys(options).map((id) => {
          const bg = sortKey === id ? "bg-stone-700" : "bg-stone-600";
          return (
            <label
              className={`text-white cursor-pointer hover:bg-stone-700 hover:text-stone-300 ${bg} px-4 py-2`}
              key={id}
            >
              <input
                type="radio"
                name="sort"
                value={id}
                className="hidden"
                checked={sortKey === id}
                onClick={(e) => {
                  if (sortKey === (e.target as HTMLInputElement).value) {
                    setSortKey(null);
                    setOpen(false);
                  }
                }}
                onChange={(e) => {
                  setSortKey(e.target.value);
                  setOpen(false);
                  submit(e.target.form, { replace: true });
                }}
              />
              {options[id]}
            </label>
          );
        })}
      </div>
    </details>
  );
}
