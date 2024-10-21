export const basemapLayers = {
  //transit stations?
};

export const boundaryLayers = [
  {
    key: "county",
    id: "Counties and Muncipalities",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Boundaries/DVRPC_MCD_PhiCPA/FeatureServer/0/query?where=state_name%3D%27New+Jersey%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&timeReferenceUnknownClient=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&datumTransformation=&f=geojson",
    layer: {
      id: "county",
      type: "line",
      paint: {
        "line-color": "#6e6e6e",
        "line-width": 1.75,
      },
    },
  },
  {
    key: "congressional",
    id: "Congressional Districts",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Boundaries/NJ_Congressional/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&timeReferenceUnknownClient=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&datumTransformation=&f=geojson",
    layer: {
      id: "congressional",
      type: "line",
      paint: {
        "line-color": "#6e6e6e",
        "line-width": 1.75,
      },
    },
  },
  {
    key: "legislative",
    id: "Legislative Districts",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Boundaries/NJ_State_Legislative/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&gdbVersion=&historicMoment=&returnDistinctValues=false&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&multipatchOption=xyFootprint&resultOffset=&resultRecordCount=&returnTrueCurves=false&returnExceededLimitFeatures=false&quantizationParameters=&returnCentroid=false&timeReferenceUnknownClient=false&sqlFormat=none&resultType=&featureEncoding=esriDefault&datumTransformation=&f=geojson",
    layer: {
      id: "legislative",
      type: "line",
      paint: {
        "line-color": "#6e6e6e",
        "line-width": 1.75,
      },
    },
  },
];

export const togglableLayers = [
  {
    key: "ipd",
    id: "Indicators of Potential Disadvantage (2022)",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2022/FeatureServer/0/query?where=geoid20+like+%2734%25%27&outFields=IPD_SCORE&outSR=4326&f=geojson",
    layer: {
      link: "https://www.dvrpc.org/webmaps/ipd/#map",
      id: "ipd",
      type: "fill",
      continuous: true,
      legend: [
        ["#253494", "Higher"],
        ["#2c7fb8", ""],
        ["#41b6c4", ""],
        ["#a1dab4", ""],
        ["#ffffcc", "Lower"],
      ],
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "ipd_score"],
          9,
          "#ffffd9",
          13,
          "#edf8b1",
          15,
          "#c7e9b4",
          17,
          "#7fcdbb",
          19,
          "#41b6c4",
          21,
          "#1d91c0",
          24,
          "#225ea8",
          27,
          "#253494",
          30,
          "#081d58",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          0.75,
          9,
          0.5,
          11,
          0.25,
        ],
      },
    },
  },
  {
    key: "racialminority",
    id: "Racial Minority Population Group (IPD 2022)",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2022/FeatureServer/0/query?where=geoid20+like+%2734%25%27&outFields=RM_SCORE&outSR=4326&f=geojson",
    layer: {
      id: "racialminority",
      link: "https://www.dvrpc.org/webmaps/ipd/#map",
      type: "fill",
      legend: [
        ["#253494", "Well Above Average"],
        ["#2c7fb8", "Above Average"],
        ["#41b6c4", "Average"],
        ["#a1dab4", "Below Average"],
        ["#ffffcc", "Well Below Average"],
      ],
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "rm_score"],
          0,
          "#ffffcc",
          1,
          "#a1dab4",
          2,
          "#41b6c4",
          3,
          "#2c7fb8",
          4,
          "#253494",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          0.75,
          9,
          0.5,
          11,
          0.25,
        ],
      },
    },
  },
  {
    key: "lowincome",
    id: "Low-Income Popluation Group (IPD 2022)",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2022/FeatureServer/0/query?where=geoid20+like+%2734%25%27&outFields=LI_SCORE&outSR=4326&f=geojson",
    layer: {
      id: "lowincome",
      type: "fill",
      legend: [
        ["#253494", "Well Above Average"],
        ["#2c7fb8", "Above Average"],
        ["#41b6c4", "Average"],
        ["#a1dab4", "Below Average"],
        ["#ffffcc", "Well Below Average"],
      ],
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "li_score"],
          0,
          "#ffffcc",
          1,
          "#a1dab4",
          2,
          "#41b6c4",
          3,
          "#2c7fb8",
          4,
          "#253494",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          0.75,
          9,
          0.5,
          11,
          0.25,
        ],
      },
    },
  },
  {
    key: "cmp",
    id: "Congestion Management Subcorridor Areas",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Transportation/cmp2023_corridorareas/FeatureServer/0/query?where=state='NJ'&outfields=*&outsr=4326&f=geojson",
    layer: {
      link: "https://www.dvrpc.org/webmaps/CMP2019/",
      id: "cmp",
      type: "fill",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "cmp_id"], 1],
          "#82D4F2",
          ["==", ["get", "cmp_id"], 2],
          "#37C2F1",
          ["==", ["get", "cmp_id"], 3],
          "#B57DB6",
          ["==", ["get", "cmp_id"], 4],
          "#92D3C8",
          ["==", ["get", "cmp_id"], 5],
          "#D7C19E",
          ["==", ["get", "cmp_id"], 6],
          "#F9BDBF",
          ["==", ["get", "cmp_id"], 7],
          "#8BC867",
          ["==", ["get", "cmp_id"], 8],
          "#FEEAAE",
          ["==", ["get", "cmp_id"], 9],
          "#D7B09E",
          ["==", ["get", "cmp_id"], 10],
          "#FFD380",
          ["==", ["get", "cmp_id"], 11],
          "#92D3C8",
          ["==", ["get", "cmp_id"], 12],
          "#F4C0D9",
          ["==", ["get", "cmp_id"], 13],
          "#DABEDB",
          ["==", ["get", "cmp_id"], 14],
          "#F5CA7A",
          ["==", ["get", "cmp_id"], 15],
          "#D3FFBE",
          ["==", ["get", "cmp_id"], 16],
          "#00E6A9",
          ["==", ["get", "cmp_id"], 17],
          "#FFFF00",
          "#cccccc",
        ],
        "fill-opacity": 0.4,
      },
    },
  },
  {
    key: "connections",
    id: "Connections 2050 Centers",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Planning/LRP_2050_PlanningCenters/FeatureServer/0/query?where=state='NJ'&outFields=lup_type&geometryPrecision=4&outSR=4326&f=geojson",
    layer: {
      id: "connections",
      type: "fill",
      legend: [
        ["#993404", "Metropolitan Center"],
        ["#d95f0e", "Metropolitan Subcenter"],
        ["#fe9929", "Suburban Center"],
        ["#fec44f", "Planned Town Center"],
        ["#fee391", "Town Center"],
        ["#ffffd4", "Rural Center"],
      ],
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "lup_type"], "Metropolitan Center"],
          "#993404",
          ["==", ["get", "lup_type"], "Metropolitan Subcenter"],
          "#d95f0e",
          ["==", ["get", "lup_type"], "Suburban Center"],
          "#fe9929",
          ["==", ["get", "lup_type"], "Town Center"],
          "#fee391",
          ["==", ["get", "lup_type"], "Rural Center"],
          "#ffffd4",
          ["==", ["get", "lup_type"], "Planned Town Center"],
          "#fec44f",
          "#cccccc",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          0.75,
          9,
          0.5,
          11,
          0.25,
        ],
      },
    },
  },
  {
    key: "freight",
    id: "Freight Centers",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Planning/LRP_2045_Freight_Centers/FeatureServer/0/query?where=1%3D1&outFields=types&outSR=4326&f=geojson",
    layer: {
      id: "freight",
      type: "fill",
      legend: [
        ["#f4bd48", "International Gateway"],
        ["#ef7e51", "Heavy Industrial"],
        ["#ca4b66", "Distribution and Logistics"],
        ["#883272", "High Tech Manufacturing"],
        ["#312867", "Local Manufacturing and Distribution"],
      ],
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "types"], "International Gateway"],
          "#f4bd48",
          ["==", ["get", "types"], "Heavy Industrial"],
          "#ef7e51",
          ["==", ["get", "types"], "Distribution and Logistics"],
          "#ca4b66",
          ["==", ["get", "types"], "High Tech Manufacturing"],
          "#883272",
          ["==", ["get", "types"], "Local Manufacturing and Distribution"],
          "#312867",
          "#cccccc",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          1,
          7,
          0.75,
          9,
          0.5,
          11,
          0.25,
        ],
      },
    },
  },
  {
    key: "urbanizedareas",
    id: "Urbanized Areas",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Boundaries/UrbanAreas_NJDOT_Adjusted_2020/FeatureServer/0/query?where=1=1&outfields=uace20&outsr=4326&f=geojson",
    layer: {
      id: "urbanizedareas",
      type: "fill",
      paint: {
        "fill-color": "#73B2FF",
        "fill-opacity": 0.4,
      },
    },
  },
  // {
  //   key: "federalaidroutes",
  //   id: "Federal Aid Routes",
  //   type: "geojson",
  //   data: "https://mapservices.pasda.psu.edu/server/rest/services/pasda/PennDOT/MapServer/2/query?where=FED_AID_SY=%271%27&outSR=4326&f=geojson",
  //   layer: {
  //     id: "federalaidroutes",
  //     type: "line",
  //     paint: {
  //       "line-color": "#A7C636",
  //     },
  //   },
  // },
  {
    key: "trails",
    id: "Circuit Trails",
    type: "geojson",
    data: "https://arcgis.dvrpc.org/portal/rest/services/Transportation/CircuitTrails/FeatureServer/0/query?where=1%3D1&outFields=circuit&outSR=4326&f=geojson",
    layer: {
      link: "https://www.dvrpc.org/webmaps/thecircuit/",
      id: "trails",
      type: "line",
      legend: [
        ["#7EB238", "Existing"],
        ["#fdae61", "In Progress"],
        ["#AF46A4", "Pipeline"],
        ["#329aa7", "Planned"],
      ],
      paint: {
        "line-color": [
          "case",
          ["==", ["get", "circuit"], "Existing"],
          "#7EB238",
          ["==", ["get", "circuit"], "In Progress"],
          "#fdae61",
          ["==", ["get", "circuit"], "Pipeline"],
          "#AF46A4",
          ["==", ["get", "circuit"], "Planned"],
          "#329aa7",
          "#cccccc",
        ],
        "line-width": 3,
      },
    },
  },
];
