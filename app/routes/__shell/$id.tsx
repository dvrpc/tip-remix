import {
  json,
  Link,
  LoaderFunction,
  useLoaderData,
  useLocation,
  useOutletContext,
} from "remix";
import { getProject } from "~/project";
import { useAppContext } from "~/AppContext";

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
  const { setIsVisible } = useOutletContext();

  return (
    <article className="bg-stone-700 max-h-full max-w-full overflow-auto p-8 prose prose-stone sm:prose-invert">
      <div className="flex">
        <Link
          to={{ pathname: basename, search: location.search }}
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
        <div
          className="bg-yellow-400 cursor-pointer font-bold hover:bg-yellow-500 mb-4 ml-auto no-underline p-2 rounded text-stone-700"
          onClick={() =>
            setIsVisible(
              (prev: { isGeneral: boolean; visibility: boolean }) => {
                return {
                  ...prev,
                  isGeneral: false,
                  visibility: true,
                };
              }
            )
          }
        >
          Comment
        </div>
      </div>
      <h2 className="mt-0">
        {project.id} | {project.road_name} {mcds}
      </h2>

      <p>
        {project.description ? project.description : "No description provided."}
      </p>
      {project.limits && (
        <p>
          <strong>Limits:</strong> {project.limits}
        </p>
      )}
      {project.aq_code && (
        <p>
          <strong>Air Quality Code</strong>: {project.aq_code}
        </p>
      )}
      <table className="mt-4 table-fixed">
        <caption>
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
              FY{startYear + 4}-{startYear + 12}
            </th>
          </tr>
        </thead>
        <tbody className="border-y-2">
          {project.funding?.data.map((row: number[]) => (
            <tr key={row[0] + row[1]} className="border-b-white/5">
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
            <td colSpan={2}>Program Year Totals (in Thousands):</td>
            <td className="font-bold">{funding && funding[0]}</td>
            <td className="font-bold">{funding && funding[1]}</td>
            <td className="font-bold">{funding && funding[2]}</td>
            <td className="font-bold">{funding && funding[3]}</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td colSpan={2}>
              Total FY{startYear}-FY{endYear} Cost (in Thousands):
            </td>
            <td>{funding && funding[4]}</td>
            <td colSpan={2}>
              Total FY{startYear}-FY{startYear + 12} Cost (in Thousands):
            </td>
            <td>{funding && funding[5]}</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      {project.milestones?.data?.length ? (
        <table className="mt-4 table-auto">
          <caption>
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
