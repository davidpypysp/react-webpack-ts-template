const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
    entry: {
        index: "./src/index.tsx",
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                type: "javascript/auto",
                test: /\.mjs$/,
                use: [],
            },
            {
                test: /\.(less|css|scss)$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[path][name].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts/",
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
        alias: {
            src: path.resolve(__dirname, "src"),
            assets: path.resolve(__dirname, "assets"),
        },
    },
    output: {
        path: __dirname + "/dist",
        publicPath: "/",
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devServer: {
        host: "0.0.0.0",
        contentBase: __dirname + "/assets",
        historyApiFallback: true,
        port: 9000,
    },
    devtool: "eval-source-map",
    plugins: [
        new ProgressBarPlugin(),
        new MiniCssExtractPlugin(),
        new ESLintPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
        new CompressionPlugin(),
        new webpack.DefinePlugin({
            "process.env": "{}",
        }),
    ],
};
