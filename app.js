require("module-alias/register");
require("dotenv").config();

const express = require("express");

const path = require ("path");

const cookieParser = require ("cookie-parser");

const logger = require ("morgan");

const cors = require ("cors");
const params = require ("strong-params");

const error = require("./helpers/error");
const indexRouter = require ("./routes/index");

const app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(params.expressMiddleware());

app.use("/", indexRouter);

app.use(error);

module.exports = app;
