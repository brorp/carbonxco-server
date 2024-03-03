const express = require("express");
const route = express();
const cms_route = require("./cms")
const web_route = require("./web")
const VersionController = require('../controllers/versionController');

route.get("/v1", VersionController.status);
route.use("/v1/w", web_route)
route.use("/v1/c", cms_route)

module.exports = route;