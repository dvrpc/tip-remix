import { useRef } from "react";
import { Form, Link, useNavigate, useOutletContext, useSubmit } from "remix";
import { useAppContext } from "~/AppContext";
import CategoryIcon, {
  links as categoryIconLinks,
} from "~/components/CategoryIcon";
import ProjectLink from "~/components/ProjectLink";

export const links = () => {
  return categoryIconLinks();
};

export default function NotMapped() {
  const {
    appContext: { basename },
  } = useAppContext();
  const { location, projects, mappedProjects, setHoverProject } =
    useOutletContext();
  return (
    <article
      className="flex flex-col max-h-full"
      style={{ colorScheme: "dark" }}
    >
      <div className="flex m-8 mb-0">
        <Link
          to={{ pathname: basename, search: location.search }}
          className="bg-yellow-400 hover:bg-yellow-500 inline-block mb-4 no-underline p-2 rounded text-stone-700"
        >
          &#10094; Back
        </Link>
        <h2 className="mx-auto text-xl">Not Mapped Projects</h2>
      </div>
      <ul className="flex flex-col overflow-auto p-8 pt-0">
        {projects?.map((p: any) => {
          return (
            !mappedProjects.has(p.id) && (
              <li
                className="flex flex-nowrap flex-row hover:bg-stone-700 hover:underline items-stretch"
                key={p.id}
                id={p.id}
                data-p={JSON.stringify(p)}
                onMouseEnter={(e) => setHoverProject(e.target.closest("li").id)}
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
            )
          );
        })}
      </ul>
    </article>
  );
}
