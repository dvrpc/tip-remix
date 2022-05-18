import { json } from "remix";
import { getLines, getPoints } from "~/loaders";

import { linesLayer } from "~/pa-tip-lines-layer";
import { pointsLayer } from "~/pa-tip-points-layer";

export const loader = async ({ params }) => {
  let [lines, points] = await Promise.all([
    getLines(params.ids),
    getPoints(params.ids),
  ]);
  lines = { ...lines, id: "pa-tip-lines", layer: linesLayer };
  points = { ...points, id: "pa-tip-points", layer: pointsLayer };
  return json([lines, points]);
};
