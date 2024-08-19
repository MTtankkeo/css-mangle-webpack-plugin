const CSSMangleWebpackPlugin = require("css-mangle-webpack-plugin").default;

/** @type {import("webpack").Configuration} */
const config = {
    mode: "production",
    entry: "./src/index.js",
    plugins: [new CSSMangleWebpackPlugin()]
}

module.exports = config;