import { json } from "remix";
import { getLines, getPoints } from "~/loaders";

import {
  backlightedLinesLayer,
  highlightedLinesLayer,
  linesLayer,
} from "~/nj-tip-lines-layer";
import {
  backlightedPointsLayer,
  highlightedPointsLayer,
  pointsLayer,
} from "~/nj-tip-points-layer";

export const loader = async ({ params }) => {
  let [lines, points] = await Promise.all([
    getLines(params.ids),
    getPoints(params.ids),
  ]);
  lines = {
    ...lines,
    id: "nj-tip-lines",
    layer: linesLayer,
    highlightLayer: highlightedLinesLayer,
    backlightLayer: backlightedLinesLayer,
  };
  points = {
    ...points,
    id: "nj-tip-points",
    layer: pointsLayer,
    highlightLayer: highlightedPointsLayer,
    backlightLayer: backlightedPointsLayer,
  };
  return json([lines, points]);
};
