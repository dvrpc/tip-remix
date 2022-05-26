import { json } from "remix";
import { getLines, getPoints } from "~/loaders";

import {
  backlightedLinesLayer,
  highlightedLinesLayer,
  linesLayer,
} from "~/pa-tip-lines-layer";
import {
  backlightedPointsLayer,
  highlightedPointsLayer,
  pointsLayer,
} from "~/pa-tip-points-layer";

export const loader = async ({ params }) => {
  let [lines, points] = await Promise.all([
    getLines(params.ids),
    getPoints(params.ids),
  ]);
  lines = {
    ...lines,
    id: "pa-tip-lines",
    layer: linesLayer,
    highlightLayer: highlightedLinesLayer,
    backlightLayer: backlightedLinesLayer,
  };
  points = {
    ...points,
    id: "pa-tip-points",
    layer: pointsLayer,
    highlightLayer: highlightedPointsLayer,
    backlightLayer: backlightedPointsLayer,
  };
  return json([lines, points]);
};
