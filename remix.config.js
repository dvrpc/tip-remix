/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { mountRoutes } = require("remix-mount-routes");
const basePath = process.env.REMIX_BASEPATH ?? "/tip/pa/map";

module.exports = {
  ignoredRouteFiles: [".*"],
  publicPath: `${basePath}/build/`,
  assetsBuildDirectory: `public${basePath}/build`,
  serverDependenciesToBundle: ["mapbox-gl"],
  routes: () => mountRoutes(basePath, "routes"),
};
