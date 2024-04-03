import { Link, useOutletContext } from "remix";
import { useAppContext } from "~/AppContext";

export default function HowToUse() {
  const {
    appContext: { basename },
  } = useAppContext();
  const { location, setIsVisible } = useOutletContext();
  return (
    <article className="bg-stone-700 max-h-full max-w-full overflow-auto p-8 prose prose-stone sm:prose-invert">
      <Link
        to={{ pathname: basename, search: location.search }}
        className="bg-yellow-400 hover:bg-yellow-500 inline-block mb-4 no-underline p-2 rounded text-stone-700"
        onClick={() => {
          setIsVisible((prev: { isGeneral: boolean; visibility: boolean }) => {
            return {
              ...prev,
              isGeneral: false,
              visibility: false,
            };
          });
        }}
      >
        &#10094; Back
      </Link>
      <div>
        <p>
          This application allows you to search for and see projects included in
          the Draft DVRPC FY2023 TIP for Pennsylvania (FY23-FY26) on a map. This
          Draft TIP was developed jointly in cooperation with PennDOT, SEPTA,
          Pottstown Area Rapid Transit (PART), and DVRPC's member cities and
          counties.
        </p>
        <p>
          During times when the public is asked to comment on a Draft TIP, this
          application allows the user to send a comment on a specific project or
          on the overall program. When this site is not open for the submission
          of comments, it is always available to review or map the program and
          individual projects in an interactive way.
        </p>
        <p>
          <strong>
            The Draft TIP, including comments submitted during the comment
            period and any recommended changes, were presented to DVRPC
            stakeholders and the DVRPC Board for adoption on Thursday, July 28,
            2022.
          </strong>
        </p>
        <p>
          The Draft TIP, including comments submitted during the comment period
          and any recommended changes, will be presented to DVRPC stakeholders
          and the DVRPC Board for adoption on Thursday, July 28, 2022.
        </p>
        <h2>How to Use & Map Navigation</h2>
        <p>
          Click-and-drag on the map to pan, or use your mouse wheel to zoom
          in/out. Double-clicking on an area will also zoom in. If you hold down
          the Shift Key and drag a box on the map, it will zoom into the area
          drawn.
        </p>
        <p>
          The menu on the right has visible project categories highlighted in
          various colors.
        </p>
        <p>
          You can search and view all Draft TIP projects by searching by keyword
          or by PennDOT’s MPMS number which is a unique identifier, which is
          located in the main header. You can also use several filters from drop
          downs under the search bar. You can sort by ID (MPMS #), Name, or
          category. You can filter by category (bike/ped improvement, bridge
          rehab/replace, transit improvements, etc…), by Air Quality Code, Fund,
          or even Long-Range Plan Major Regional Project (MRP) code.
        </p>
        <h2>Geospatial Data Layers</h2>
        <p>
          As part of DVRPC’s effort to support planning and improve
          decision-making in the region, you can choose to turn on or off the
          geospatial boundary or layer information that are located at the top
          right corner of the map. This function can allow you to better
          understand and see the relevance of a Draft TIP project’s relation to
          important planning components, such as Environmental Justice,
          Congestion, or Freight Corridors, for example.
        </p>
        <h2>Submit Comments</h2>
        <p>
          To leave a comment on a Draft TIP project, first select that project
          on the map or from the list on the right-hand side. Then, click on the
          yellow “Comment” button above the name of the project and then
          complete the comment form. Click “Submit” when completed.
        </p>
        <p>
          To leave a general comment about the Draft TIP document, click on the
          yellow "General Comment” button at the top of the webmap application,
          just to the left of the “Overview & Documents” link. A comment form
          will open for you to complete. Once the form is completed, click on
          the “Submit” button.
        </p>
        <h2>Read Comments</h2>
        <p>
          Read Comments{" "}
          <a
            href="https://www.dvrpc.org/asp/PATIPComment/comments.aspx"
            target="_blank"
          >
            Here
          </a>
        </p>
      </div>
    </article>
  );
}
