/**
 * Factory method for creating a sort function given a property name and optionally sorted descending.
 *
 * @param {string} prop
 * @param {boolean} isAscending
 * @returns Function
 */
export function sortByProperty(prop, isAscending = true) {
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
export function getCategoryColor(category) {
  if (category in categories) return categories[category];
  else return categories.Other;
}
