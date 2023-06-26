import { useRef } from "react";
import { Form, Link, useNavigate, useOutletContext, useSubmit } from "remix";
import { sortByProperty } from "~/utils";
import DetailsToggle from "~/components/DetailsToggle";
import CategoryIcon, {
  links as categoryIconLinks,
} from "~/components/CategoryIcon";
import ProjectLink from "~/components/ProjectLink";

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
    mappedProjects,
    projectsWithinView,
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
  let params = new URLSearchParams(location.search);

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
            onChange={(e) => {
              if (!e.target.value.length) {
                params.set("keyword", "");
                navigate({
                  pathname: location.pathname,
                  search: params.toString(),
                });
              }
            }}
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
          <div className="gap-2 grid grid-cols-3 items-stretch">
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
          <div className="gap-2 grid grid-cols-3 my-2">
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
        {projects.length ? (
          projects?.sort(sortByProperty(sortKey, true)).map((p: any) => {
            return mappedProjects.has(p.id) && !projectsWithinView.size ? (
              <ProjectLink p={p} />
            ) : (
              projectsWithinView.has(p.id) && <ProjectLink p={p} />
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center min-w-full prose text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0,0,256,256"
              width="120px"
              height="120px"
            >
              <g fill="#ffffff">
                <g transform="scale(8.53333,8.53333)">
                  <path d="M13,3c-5.511,0 -10,4.489 -10,10c0,5.511 4.489,10 10,10c2.39651,0 4.59738,-0.85101 6.32227,-2.26367l5.9707,5.9707c0.25082,0.26124 0.62327,0.36648 0.97371,0.27512c0.35044,-0.09136 0.62411,-0.36503 0.71547,-0.71547c0.09136,-0.35044 -0.01388,-0.72289 -0.27512,-0.97371l-5.9707,-5.9707c1.41266,-1.72488 2.26367,-3.92576 2.26367,-6.32227c0,-5.511 -4.489,-10 -10,-10zM13,5c4.43012,0 8,3.56988 8,8c0,4.43012 -3.56988,8 -8,8c-4.43012,0 -8,-3.56988 -8,-8c0,-4.43012 3.56988,-8 8,-8z" />
                </g>
              </g>
            </svg>
            <h1 className="mb-0 text-2xl text-white">
              Sorry no projects found
            </h1>
            <div>Try seaching/filtering again...</div>
          </div>
        )}
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
