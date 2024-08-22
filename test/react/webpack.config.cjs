const CSSMangleWebpackPlugin = require("css-mangle-webpack-plugin").default;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/** @type {import("webpack").Configuration} */
const config = {
    mode: "production",
    entry: "./src/index.js",
    plugins: [
        new CSSMangleWebpackPlugin({mangle: {className: true}}),
        new MiniCssExtractPlugin(),
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: true,
        })
    ],
    module: {
        rules: [
            { // About CSS loader.
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
}

module.exports = config;