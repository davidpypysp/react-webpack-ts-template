const path = require("path");

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
    optimization: {
        minimize: false,
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "server.bundle.js",
    },
};
