import { Link, useOutletContext } from "remix";
import CategoryIcon from "./CategoryIcon";

export default function ProjectLink({ p }) {
  const { setHoverProject, location } = useOutletContext();
  return (
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
  );
}
