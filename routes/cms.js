const express = require("express");
const cms_router = express();
const FaqController = require('../controllers/faqController');
const ClientController = require('../controllers/clientController');
const TeamController = require('../controllers/teamController');
const BlogController = require('../controllers/blogController');
const JobController = require('../controllers/jobController');
const ProjectController = require('../controllers/projectController');
const AuthController = require('../controllers/authController');
const CareerController = require("@controllers/careerController");
const authentication = require('../middlewares/authentication');
const DocumentController = require("@controllers/documentController");
const { parseFile } = require("@helpers/multer");

cms_router.post('/login', AuthController.login)

cms_router.use(authentication)

// FAQs
cms_router.post("/faqs", FaqController.post);
cms_router.get("/faqs", FaqController.all);
cms_router.get("/faqs/:id", FaqController.detail);
cms_router.put("/faqs/:id", FaqController.update);
cms_router.patch("/faqs/:id/archive", FaqController.archived)
cms_router.delete("/faqs/:id", FaqController.delete);

// Teams
cms_router.post("/teams", TeamController.post);
cms_router.get("/teams", TeamController.all);
cms_router.get("/teams/:id", TeamController.detail);
cms_router.put("/teams/:id", TeamController.update);
cms_router.delete("/teams/:id", TeamController.delete);

// Blogs
cms_router.post("/blogs", BlogController.post);
cms_router.get("/blogs", BlogController.all);
cms_router.get("/blogs/:id", BlogController.detail);
cms_router.put("/blogs/:id", BlogController.update);
cms_router.delete("/blogs/:id", BlogController.delete);

// Projects
cms_router.post("/projects", ProjectController.post);
cms_router.get("/projects", ProjectController.all);
cms_router.get("/projects/:id", ProjectController.detail);
cms_router.put("/projects/:id", ProjectController.update);
cms_router.delete("/projects/:id", ProjectController.delete);

// Contact Us
cms_router.get("/contact-us", ClientController.all);
cms_router.get("/contact-us/:id", ClientController.detail);
cms_router.delete("/contact-us/:id", ClientController.delete);

// Jobs
cms_router.post("/jobs", JobController.post);
cms_router.get("/jobs", JobController.all);
cms_router.get("/jobs/:id", JobController.detail);
cms_router.put("/jobs/:id", JobController.update);
cms_router.delete("/jobs/:id", JobController.delete);

// Applicant
cms_router.get("/applicants", CareerController.all);
cms_router.delete("/applicants/:id", CareerController.delete);

cms_router.post("/documents", parseFile, DocumentController.post);
cms_router.delete("/documents/:id", DocumentController.delete);
cms_router.get("/documents/:id/url", DocumentController.url);

module.exports = cms_router