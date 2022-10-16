const path = require("path");
const webpack = require("webpack"); // to access built-in plugins
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background", "background.ts"),
        popup: path.resolve(__dirname, "..", "src", "popup", "index.tsx"),
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: ".", context: "public" }],
        }),
        new HtmlWebpackPlugin({ template: "./src/popup/index.html" }),
    ],
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
};
