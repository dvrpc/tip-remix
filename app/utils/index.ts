import type { MapboxGeoJSONFeature } from "mapbox-gl";
/**
 * Factory method for creating a sort function given a property name and optionally sorted descending.
 *
 * @param {string} prop
 * @param {boolean} isAscending
 * @returns Function
 */
export function sortByProperty(prop: string, isAscending: boolean = true) {
  return (a, b) => {
    if (a[prop] < b[prop]) {
      return isAscending ? -1 : 1;
    }
    if (a[prop] > b[prop]) {
      return isAscending ? 1 : -1;
    }
    return 0;
  };
}

/**
 * Helper function to parse an array of GeoJson features and generate a bounding box
 *
 * @param {object} data
 * @returns object
 */
export function getBoundingBox({
  features,
}: {
  features: MapboxGeoJSONFeature[];
}): {} {
  let bounds = {};

  for (let i = 0; i < features.length; i++) {
    //Point
    let coords = features[i].geometry.coordinates;
    if (["MultiPoint", "LineString"].includes(features[i].geometry.type))
      coords = coords.flat();
    else if (["MultiLineString", "Polygon"].includes(features[i].geometry.type))
      coords = coords.flat(2);
    else if ("MultiPolygon" === features[i].geometry.type)
      coords = coords.flat(3);

    const [longitude, latitude] = coords;
    bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
    bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
    bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
    bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
  }

  return bounds;
}

export const categories = {
  Other: "#5abf41",
  null: "#5abf41",
  "Intersection/Interchange Improvements": "#ffc10e",
  "Signal/ITS Improvements": "#ed1c24",
  "Roadway Rehabilitation": "#511851",
  "Bicycle/Pedestrian Improvement": "#f26522",
  Streetscape: "#0b6d32",
  "Bridge Repair/Replacement": "#223860",
  "Transit Improvements": "#729faa",
  "Roadway New Capacity": "#9d1d20",
};

/**
 * Lookup for corresponding theme colors of TIP project categories
 *
 * @param {string} category name
 * @returns {string} color for the category
 */
export function getCategoryColor(category: string): string {
  if (category in categories) return categories[category];
  else return categories.Other;
}
