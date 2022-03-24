// next.config.js
const withReactSvg = require("next-react-svg");
const path = require("path");
const isProd = (process.env.NODE_ENV || "production") === "production";

module.exports = withReactSvg({
  include: path.resolve(__dirname, "public/icons"),
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  assetPrefix: isProd ? process.env.NEXT_PUBLIC_BASE_PATH : "",
});
