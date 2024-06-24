import {
  json,
  Link,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "remix";
import { getProject } from "~/project";
import { useAppContext } from "~/AppContext";
import { getBoundingBox } from "~/utils";
import { LngLatBounds } from "mapbox-gl";

type Project = {
  municipalities?: string;
  county: string;
  id: string;
  road_name: string;
  description: string;
  limits: string;
  aq_code: string;
  funding: any;
  milestones: {
    data: any[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  return params.id && json(await getProject(params.id));
};

/**
 * Formats municipalities and county as follows:
 *
 * 1 municipality, 1 county: `(${mcd}, ${county})`
 * 2 municipalities: `(${mcd1} & ${mcd2}, ${county})`
 * 3+ municipalities: `(${mcd1}, ${mcdX} & ${mcdLast}, $county)`
 * No county provided: `(${mcd})`
 * No municipality or county: <empty string>
 *
 * @param {Object} project
 * @returns string
 */
function formatLocation(project: Project): string {
  let mcdArr = project.municipalities?.split(",") || [""];
  const lastMcd = mcdArr.pop();
  let mcds = "";
  if (mcdArr.length) {
    mcds += mcdArr.join(",") + ` & ${lastMcd}, `;
  } else {
    mcds += lastMcd ? `${lastMcd}, ` : "";
  }
  if (project.county === "SEPTA") {
    mcds += project.county;
  } else if (
    project.county !== "Various" &&
    project.county !== "Philadelphia"
  ) {
    mcds += `${project.county} County`;
  } else {
    mcds = mcds.substring(0, mcds.length - 2);
  }
  if (mcds.length) {
    mcds = `(${mcds})`;
  }
  return mcds;
}

export default function ProjectDetails() {
  const {
    appContext: { appName, basename, startYear, endYear },
  } = useAppContext();
  const project = useLoaderData();
  const location = useLocation();
  const mcds = formatLocation(project);
  const funding = project.funding?.data
    ? getTotals(project.funding?.data)
    : null;
  const { setIsVisible, mappedProjects, map } = useOutletContext();

  return (
    <article className="bg-stone-700 max-h-full max-w-full overflow-auto p-8 prose prose-stone sm:prose-invert">
      <div className="flex">
        <Link
          to={{
            pathname: location.pathname.replace(/[^\/]+$/, ""),
            search: location.search,
          }}
          className="bg-yellow-400 hover:bg-yellow-500 inline-block mb-4 no-underline p-2 rounded text-stone-700"
          onClick={() => {
            setIsVisible(
              (prev: { isGeneral: boolean; visibility: boolean }) => {
                return {
                  ...prev,
                  isGeneral: false,
                  visibility: false,
                };
              }
            );
          }}
        >
          &#10094; Back
        </Link>
        <button
          className="flex hover:bg-stone-600 items-center justify-center mb-4 min-w-[33%] ml-auto p-2 rounded"
          onClick={(e) => {
            if (typeof window !== "undefined") {
              const button = e.currentTarget;
              const buttonText = e.currentTarget.innerHTML;
              button.innerText = "✓ Copied";
              navigator.clipboard.writeText(window.location.href);
              setTimeout(() => {
                button.innerHTML = buttonText;
              }, 2000);
            }
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z"
              fill="currentColor"
            />
          </svg>
          Copy URL to clipboard
        </button>
      </div>
      {mappedProjects.has(project.id) && (
        <button
          className="bg-yellow-400 hover:bg-yellow-500 inline-block mb-4 mr-4 no-underline p-2 rounded text-stone-700"
          onClick={() => {
            const features = ["pa-tip-points", "pa-tip-lines"]
              .map((layer) =>
                map.current?.querySourceFeatures(layer, {
                  filter: ["in", "mpms_id", project.id],
                })
              )
              .reduce((prev, curr) => [...prev, ...curr]);
            const bbox = getBoundingBox({ features });
            const { xMin, xMax, yMin, yMax } = bbox;
            const center = new LngLatBounds(
              [xMin, yMin],
              [xMax, yMax]
            ).getCenter();
            window.open(
              `http://maps.google.com/maps?q=&layer=c&cbll=${center.lat},${center.lng}&cbp=11,0,0,0,0`
            );
          }}
        >
          Streetview
        </button>
      )}
      {project.id ? (
        <>
          <h2 className="mt-0">
            {project.id} | {project.road_name} {mcds}
          </h2>

          <p
            dangerouslySetInnerHTML={{
              __html: project.description
                ? project.description.replace(/[\r\n]+/g, "<br/>")
                : "No description provided.",
            }}
          ></p>
          {project.limits && (
            <div>
              <strong>Limits:</strong> {project.limits}
            </div>
          )}
          {project.aq_code && (
            <div>
              <strong>Air Quality Code</strong>: {project.aq_code}
            </div>
          )}
          <table className="mt-0 table-fixed">
            <caption className="text-left">
              <h3>{appName} Program Years (in Thousands)</h3>
            </caption>
            <thead>
              <tr>
                <th>
                  <a href="/TIP/Draft/pdf/CodesAbbr.pdf">Phase</a>
                </th>
                <th>
                  <a href="/TIP/Draft/pdf/CodesAbbr.pdf">Fund</a>
                </th>
                <th>FY{startYear}</th>
                <th>FY{startYear + 1}</th>
                <th>FY{startYear + 2}</th>
                <th>FY{startYear + 3}</th>
                <th>
                  FY{startYear + 4}-{startYear + 11}
                </th>
              </tr>
            </thead>
            <tbody className="border-y-2">
              {project.funding?.data.map((row: number[]) => (
                <tr key={row.join()} className="border-b-white/5">
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>${row[2]}</td>
                  <td>${row[3]}</td>
                  <td>${row[4]}</td>
                  <td>${row[5]}</td>
                  <td>${row[6] + row[7]}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>Program Year Totals:</td>
                <td className="font-bold">{funding && funding[0]}</td>
                <td className="font-bold">{funding && funding[1]}</td>
                <td className="font-bold">{funding && funding[2]}</td>
                <td className="font-bold">{funding && funding[3]}</td>
                <td>&nbsp;</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  Total FY{startYear}-FY{endYear} Cost:
                </td>
                <td>{funding && funding[4]}</td>
                <td colSpan={2}>
                  Total FY{startYear}-FY{startYear + 11} Cost:
                </td>
                <td>{funding && funding[5]}</td>
                <td>&nbsp;</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="italic">
                  All costs in thousands.
                </td>
              </tr>
            </tfoot>
          </table>

          {project.milestones?.data?.length ? (
            <table className="mt-4 table-auto">
              <caption className="text-left">
                <h3>Milestones</h3>
              </caption>
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Milestone</th>
                  <th>Estimated Date</th>
                </tr>
              </thead>
              <tbody>
                {project.milestones.data.map((row: string[]) => (
                  <tr key={row.join()} className="border-b-white/5">
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h3>No milestones are available for this project.</h3>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
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
          <h1 className="mb-0 text-2xl">Sorry no project found</h1>
          <div>Press the back button to search/filter projects...</div>
        </div>
      )}
    </article>
  );
}

export const getTotals = (info: number[][]) => {
  let y1Funding: number,
    y2Funding: number,
    y3Funding: number,
    y4Funding: number,
    programYearsFunding: number,
    totalFunding: number;
  y1Funding =
    y2Funding =
    y3Funding =
    y4Funding =
    programYearsFunding =
    totalFunding =
      0;

  info.forEach((row) => {
    y1Funding += row[2];
    y2Funding += row[3];
    y3Funding += row[4];
    y4Funding += row[5];
    totalFunding += row[6] + row[7];
  });

  programYearsFunding = y1Funding + y2Funding + y3Funding + y4Funding;
  totalFunding += programYearsFunding;

  const formattedFunds = [
    y1Funding,
    y2Funding,
    y3Funding,
    y4Funding,
    programYearsFunding,
    totalFunding,
  ];

  // return funds as is w/o formatting for commas since we're expressing these in thousands
  return convertToCurrency(formattedFunds);
};

const convertToCurrency = (cost: number[]): string[] | null => {
  const test = 0;

  // check if browser supports the locales and options arguments of toLocaleString
  try {
    test.toLocaleString("en-US");
  } catch (e: any) {
    console.error("failed ", e);
    if (e.name === "RangeError") return null;
  }

  // add commas
  return cost.map((fund) =>
    fund
      .toLocaleString("en-US", { style: "currency", currency: "USD" })
      .slice(0, -3)
  );
};
