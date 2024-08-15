const express = require("express");
const connectToDb = require("../config/database");
const routerResources = require("./routers/resources.router");
const routerQuery = require("./routers/query.router");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router
app.use("/api/resources", routerResources);
app.use("/api/v1/query", routerQuery);

//static
app.use(express.static("public"));
connectToDb();
module.exports = app;
