export const linesLayer = {
  id: "pa-tip-lines",
  type: "line",
  paint: {
    "line-width": ["interpolate", ["linear"], ["zoom"], 1, 1, 7, 3, 11, 5.5],
    "line-color": [
      "match",
      ["get", "descriptio"],
      "Bicycle/Pedestrian Improvement",
      "#f26522",
      "Bridge Repair/Replacement",
      "#223860",
      "Streetscape",
      "#0b6d32",
      "Transit Improvements",
      "#729faa",
      "Signal/ITS Improvements",
      "#ed1c24",
      "Roadway Rehabilitation",
      "#511851",
      "Roadway New Capacity",
      "#9d1d20",
      "Intersection/Interchange Improvements",
      "#ffc10e",
      "#5abf41",
    ],
    "line-opacity": [
      "interpolate",
      ["linear"],
      ["zoom"],
      1,
      0.1,
      7,
      0.25,
      8,
      0.33,
      9,
      0.66,
      10,
      0.75,
    ],
  },
};

export const highlightedLinesLayer = {
  id: "highlight-pa-tip-lines",
  type: "line",
  paint: {
    "line-width": ["interpolate", ["linear"], ["zoom"], 1, 3, 7, 5, 11, 7.5],
    "line-color": "#444",
    "line-opacity": 0.75,
  },
  filter: ["in", "mpms_id", ""],
};

export const backlightedLinesLayer = {
  id: "backlight-pa-tip-lines",
  type: "line",
  paint: {
    "line-width": 60,
    "line-color": [
      "match",
      ["get", "descriptio"],
      "Bicycle/Pedestrian Improvement",
      "#f26522",
      "Bridge Repair/Replacement",
      "#223860",
      "Streetscape",
      "#0b6d32",
      "Transit Improvements",
      "#729faa",
      "Signal/ITS Improvements",
      "#ed1c24",
      "Roadway Rehabilitation",
      "#511851",
      "Roadway New Capacity",
      "#9d1d20",
      "Intersection/Interchange Improvements",
      "#ffc10e",
      "#5abf41",
    ],
    "line-opacity": 0.2,
  },
  filter: ["in", "mpms_id", ""],
};
