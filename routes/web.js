const express = require("express");
const web_router = express();
const FaqController = require('../controllers/faqController');
const ClientController = require('../controllers/clientController');
const TeamController = require('../controllers/teamController');
const BlogController = require('../controllers/blogController');
const JobController = require('../controllers/jobController');
const ProjectController = require('../controllers/projectController');
const CareerController = require("@controllers/careerController");
const DocumentController = require("@controllers/documentController");
const { parseFile } = require("@helpers/multer");

web_router.get("/jobs", JobController.all);
web_router.get("/jobs/:id", JobController.detail);

web_router.post("/applicants/:job_id", CareerController.post);

web_router.get("/teams", TeamController.all);
web_router.get("/teams/:id", TeamController.detail);

web_router.get("/projects", ProjectController.all);
web_router.get("/projects/:id", ProjectController.detail);
web_router.get("/projects/:id/more", ProjectController.more);

web_router.get("/blogs", BlogController.all);
web_router.get("/blogs/:id", BlogController.detail);
web_router.get("/blogs/:id/more", BlogController.more);

web_router.post("/contact-us", ClientController.post);

web_router.get("/faqs", FaqController.all);
web_router.get("/faqs/:id", FaqController.detail);

web_router.post("/documents", parseFile, DocumentController.post);
web_router.delete("/documents/:id", DocumentController.delete);

module.exports = web_router