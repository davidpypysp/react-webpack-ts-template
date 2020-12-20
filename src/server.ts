const express = require("express");
const path = require("path");
const compression = require("compression");

const server = express();
const port = 5000;
const dist_dir = __dirname;

server.use(compression());
server.use(express.static(dist_dir));
server.get("*", (req, res) => {
    res.sendFile(path.resolve(dist_dir, "index.html"));
});
server.listen(port);

console.info("Server on port", port);
