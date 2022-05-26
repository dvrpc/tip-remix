import { useRef, useState } from "react";
import { Form, Link, useNavigate, useOutletContext, useSubmit } from "remix";
import { sortByProperty } from "~/utils";
import DetailsToggle from "~/components/DetailsToggle";
import CategoryIcon, {
  links as categoryIconLinks,
} from "~/components/CategoryIcon";

interface Map {
  [key: string]: string | undefined;
}

export const links = () => {
  return categoryIconLinks();
};

export default function Panel() {
  const {
    transition,
    projects,
    funds,
    setHoverProject,
    keywordState,
    sortState,
    categoryFilterState,
    aqcodeFilterState,
    fundFilterState,
    mrpFilterState,
    location,
    categories,
  } = useOutletContext();
  const [keyword, setKeyword] = keywordState;
  const [sortKey, setSortKey] = sortState;
  const [categoryFilter, setCategoryFilter] = categoryFilterState;
  const [aqcodeFilter, setAqcodeFilter] = aqcodeFilterState;
  const [fundFilter, setFundFilter] = fundFilterState;
  const [mrpFilter, setMrpFilter] = mrpFilterState;
  const navigate = useNavigate();
  const submitHandler = useSubmit();
  const formRef = useRef<HTMLFormElement>(null);
  const submit = () => submitHandler(formRef.current);

  return (
    <article
      className="flex flex-col max-h-full"
      style={{ colorScheme: "dark" }}
    >
      <Form className="m-8 mb-0" ref={formRef}>
        <div className="flex flex-row gap-2">
          <input
            type="search"
            name="keyword"
            placeholder="Search by keyword or MPMS"
            defaultValue={keyword}
            onChange={(e) =>
              e.target.value.length ||
              navigate({
                pathname: "",
                search: { ...location.search, keyword: "" },
              })
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
        <details open className="group open:mb-6">
          <summary className="cursor-pointer group-open:before:content-['hide_'] hover:text-stone-300 text-center text-stone-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </summary>
          <div className="grid grid-cols-3 gap-2 items-stretch">
            <div className="col-span-1">
            <DetailsToggle
              options={[
                { value: "id", label: "ID" },
                { value: "road_name", label: "Name" },
                { value: "category", label: "Category" },
              ]}
              name="sortKey"
              title="Sort"
              filter={sortKey}
              setFilter={setSortKey}
              submit={submit}
            />
            </div>
            <div className="col-span-2">
            <DetailsToggle
              multiple
              filter={categoryFilter}
              setFilter={setCategoryFilter}
              options={categories}
              title="Category"
              name="categories"
              submit={submit}
            />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 my-2">
            <DetailsToggle
              multiple
              filter={aqcodeFilter}
              setFilter={setAqcodeFilter}
              options={[...new Set(projects?.map((p) => p.aq_code))].sort()}
              title="AQ Code"
              name="aqcodes"
              submit={submit}
            />
            <DetailsToggle
              multiple
              filter={fundFilter}
              setFilter={setFundFilter}
              options={[...new Set(funds.map((f) => f.code))].sort()}
              title="Fund"
              name="funds"
              submit={submit}
            />
            <DetailsToggle
              multiple
              filter={mrpFilter}
              setFilter={setMrpFilter}
              title="MRP"
              name="lrpids"
              options={[...new Set(projects?.map((p) => p.mrp))].sort()}
              submit={submit}
            />
          </div>
        </details>
      </Form>
      <ul className="flex flex-col overflow-auto p-8 pt-0">
        {projects?.sort(sortByProperty(sortKey, true)).map((p) => (
          <li
            className="flex flex-nowrap flex-row hover:bg-stone-700 hover:underline items-stretch"
            key={p.id}
            id={p.id}
            data-p={JSON.stringify(p)}
            onMouseEnter={(e) => setHoverProject(e.target.closest('li').id)}
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

  const options: Map = {
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
