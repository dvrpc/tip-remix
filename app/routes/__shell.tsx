import {
  Link,
  LoaderFunction,
  Outlet,
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams,
  useTransition,
} from "remix";
import { useRef, useState } from "react";
import { useAppContext } from "~/AppContext";
import { searchProjects } from "~/project";
import { getFunds } from "~/fund";
import Map, { links as mapLinks } from "~/components/Map";
import Modal from "~/components/Modal";

import type { MapRef } from "react-map-gl";

interface Map {
  [key: string]: string[] | undefined;
}

const categories = [
  { value: "1", label: "Bicycle/Pedestrian Improvement" },
  { value: "2", label: "Bridge Repair/Replacement" },
  { value: "3", label: "Streetscape" },
  { value: "4", label: "Transit Improvements" },
  { value: "5", label: "Signal/ITS Improvements" },
  { value: "6", label: "Roadway Rehabilitation" },
  { value: "7", label: "Roadway New Capacity" },
  { value: "8", label: "Intersection/Interchange Improvements" },
  { value: "9", label: "Other" },
];

export const links = () => {
  return mapLinks();
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");
  const filterLookup: Map = {
    typecodes: url.searchParams.getAll("categories"),
    aqcodes: url.searchParams.getAll("aqcodes"),
    fundcodes: url.searchParams.getAll("funds"),
    lrpids: url.searchParams.getAll("lrpids"),
  };
  const filters = Object.entries(filterLookup)
    .filter(([k, v]) => v[0] && v[0].length)
    .map(([k, v]) => `${k}=${v.join(",")}`)
    .join(";");
  const projects = await searchProjects(keyword, filters);
  const funds = await getFunds();
  return { projects, funds };
};

export default function Projects() {
  const {
    appContext: { appName, basename, startYear, endYear },
  } = useAppContext();
  const { projects, funds } = useLoaderData();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const transition = useTransition();
  const sortState = useState("road_name");
  const categoryFilterState = useState(
    searchParams.getAll("categories").map((i) => ({
      value: i,
      label: categories.find((c) => c.value === i)?.label,
    }))
  );
  const aqcodeFilterState = useState(
    searchParams.getAll("aqcodes").map((i) => ({ value: i, label: i }))
  );
  const fundFilterState = useState(
    searchParams.getAll("funds").map((i) => ({ value: i, label: i }))
  );
  const mrpFilterState = useState(
    searchParams.getAll("mrpids").map((i) => ({ value: i, label: i }))
  );
  const keywordState = useState(searchParams.get("keyword"));

  const [showPopup, setShowPopup] = useState(null);
  const [hoverProject, setHoverProject] = useState(null);
  const mapData = useFetcher();
  const [isVisible, setIsVisible] = useState({
    visibility: false,
    isGeneral: false,
  });

  const { data } = mapData;
  const [mappedProjects, setMappedProjects] = useState(new Set());
  if (data && !mappedProjects.size) {
    let ret = new Set();
    Object.keys(data).map((key) => {
      let { features } = data[key];
      features.map((feature) => ret.add(feature.properties.mpms_id));
    });
    setMappedProjects(ret);
  }
  const [projectsWithinView, setProjectsWithinView] = useState(new Set());
  const map = useRef<MapRef>();

  return (
    <div className="grid grid-cols-5 grid-rows-[min-content_1fr] text-stone-800 w-screen md:h-screen md:overflow-hidden">
      <nav className="col-span-3 z-50">
        <div className="flex items-center">
          <div className="divide-gray-800 divide-x-2 flex gap-6 items-center m-4">
            <a href="https://www.dvrpc.org/" rel="external">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAdCAYAAAA0PEtlAAAACXBIWXMAAAsSAAALEgHS3X78AAAEMElEQVRoge2a7XHiSBCGH1P+DxeBycBMBCdHsMoAHIF1Eaw2AzmCFREsjuAggsYRmM0AReD7MT1m1BoBvgX7bou3SiVpvvpzunsQV6+vr3wknHNZ/C4iyw9l4My4/gSaf5v3q0/g4WwYfDYDvxsuCj0xLgo9MS4KPTE6Sck5NwJyIAPG2rwBlsBCRLYfw9r/Ey2FOudyoAaG2tTo85/AFNg45367UueUeFOoc67GKy1GDTzo8xzvqS/OubmIzPoW1VqzAL5Ezc9A2TN+BsTr1SJSR/0ToIr61yJSOOcqYBK1V3rdiMhVYl6N33Uz4EbbGmABlCKy6eFvrLzntJ2tM2+gEwq6ylzphICSnUKmKkyKeIWvNb+YrlvgR2oOsMXvgnAVpj83/QET0/6DnaIARqa/Ar6aMUO87Gs1gJVnBrzomGFi3ouOAWCgMbNMCLmJnr/hLRsr/cGeetQwD7wTIrLAWzzgVvkKyM2U+r00FMMDfcuYrobA70es+z0odYB3/xShpd4bvGVLfV/hFfxMe5tC2jBPwCPw8wBTtXnP4W273UbtzyKyPrDWIVrPeBnsuCFtGSxPDT70zWk7AEDlnBsN6FofoNEYluG3X47fXnfR+208V61pDeNEJBeRQkTGykgfLPO5ufeNi/EE/KG0+nAvIhMRKXt4Coa08jRAJiIzzR9j2gYZAvmAdlAPKPWeqWILvHK3eM8NHhMTtOs8Wk9SRqxlQ9/aMJiZe8CCflQHyrp5nOx6eLrRbW/lqWN5lE6Gd7JwLa/petVcRCrN+qVzrsQrdINX5r44FKNvW65pJ5YW0/ikATDUuBQnt1VfJj4SfXMtTykn6xhSeWmtOcDHk4AVUKgyx0oo07qzoB3LDiHF1L526G7n8kD/ezE+sj3l5dkxBAbsPOlJn9f4bD7DJ6OQ+WwpA21jWI+c2TJEDdXr4WrxeM0bM2Tfdj8G0wRPhaWjW3tj5hamAhg559bOudfoKq6VySntrRUC9RQfG1IJB9oes2R3soJdGbJQ5jL6t3qMinSpMj/RsVecc+GQkuIpyL5QXmJ5NuoUW9qHA/Cy1wOtAVemo6CtrCzB2M94jApri/1Q/H5NMN6HPi/8Ve+M0cdTg4YZlWdm+of4OtseDsCfmLbh16YZu0wXjnOB2IR07Mmtx4hIyf7S6CB0zSfT3Kjhz40iTnpK8/6IeY8iUoEePXWRDL+tSrreGcedBrjrK661DLmnHQvDvL/wRf4qulKozZjkMRcft+Nxh0LCo162dFvha+baTtC2O7pGRtvuROQtv1zZj3QatBd0XbrBC1q+J5bp8XTzi+XOv4LSjr9hfVOHCXKO3vvLWUhqfQ7VUWg0ccxuq2+POO7957BPoedC71fPVNF6wWFcPoGcGBeFnhgXhZ4YF4WeGJ/xV5yPxAb/Q3LA8twE/wHgsLkEYZiXXQAAAABJRU5ErkJggg=="
                alt="DVRPC logo"
              />
            </a>
            <a href="https://www.dvrpc.org/TIP/pa/">
              <img
                src="data:image/png;base64,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"
                alt="TIP logo"
                className="h-11 ml-6"
              />
            </a>
          </div>
          <h2 className="font-bold text-xl">
            {appName} (FY{startYear}-FY{endYear})
          </h2>
        </div>
      </nav>
      <nav className="col-span-2 flex items-center justify-end pr-4 z-50">
        <ul className="divide-x flex gap-4 items-center justify-end w-full">
          <li className="md:mr-auto">
            <div
              className="cursor-pointer underline"
              onClick={() =>
                setIsVisible((prev) => {
                  return {
                    ...prev,
                    isGeneral: true,
                    visibility: true,
                  };
                })
              }
            >
              <strong className="bg-yellow-400 hover:bg-yellow-500 inline-block no-underline p-2 rounded text-stone-700">
                General Comment
              </strong>
            </div>
          </li>
          <li>
            <a className="underline" href="https://www.dvrpc.org/tip/draft/">
              Overview &amp; Documents
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://www.dvrpc.org/webmaps/mrp2050/"
              target="_blank"
            >
              Major Regional Projects
            </a>
          </li>
          <li>
            <Link
              className="underline"
              to={{ pathname: `${basename}/howtouse`, search: location.search }}
            >
              How to Use
            </Link>
          </li>
          <li>
            <Link
              className="underline"
              to={{
                pathname: `${basename}/notmapped`,
                search: location.search,
              }}
            >
              Unmapped Projects
            </Link>
          </li>
        </ul>
      </nav>
      <main className="bg-stone-700 overflow-hidden text-white md:col-span-2 md:order-2">
        <Outlet
          context={{
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
            setIsVisible,
            mappedProjects,
            projectsWithinView,
            map,
          }}
        />
      </main>
      <aside className="flex justify-center md:col-span-3">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} />
        <Map
          map={map}
          projects={projects}
          mapData={mapData}
          setShowPopup={setShowPopup}
          showPopup={showPopup}
          location={location}
          hoverProject={hoverProject}
          setProjectsWithinView={setProjectsWithinView}
        />
      </aside>
    </div>
  );
}
