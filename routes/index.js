const express = require("express");
const route = express();
const FaqController = require('../controllers/faqController');
const VersionController = require('../controllers/versionController');

route.get("/v1", VersionController.status);
route.post("/v1/faq", FaqController.post);


module.exports = route; 