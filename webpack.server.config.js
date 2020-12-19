const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "src/server.ts"),
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    target: "node",
    resolve: {
        extensions: [".ts", ".js", ".d.ts"],
        alias: {
            src: path.resolve(__dirname, "src"),
        },
    },
    // externals: [nodeExternals()]express,
    optimization: {
        minimize: false,
    },
    output: {
        path: path.resolve(__dirname, "server_dist"),
        filename: "server.bundle.js",
    },
};
