require("css-mangle-webpack-plugin");

/** @type {import("webpack").Configuration} */
const config = {
    mode: "production",
    entry: "./src/index.js",
}

module.exports = config;