const express = require("express");
const connectToDb = require("../config/database");
const routerResources = require("./routers/resources.router");
const routerQuery = require("./routers/query.router");
const routerUser = require("./routers/users.router");
const routerUserAth = require("./routers/userAuth.router");
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//static
app.use(express.static("public"));

//router
app.use("/api/resources", routerResources);
app.use("/api/v1/query", routerQuery);
app.use("/api/users", routerUser);
app.use("/user", routerUserAth);

//page not found
app.all("*", (req, res) => {
  res.status(404).sendFile("404/index.html", { root: "./public" });
  console.log("page not done!"); //test
});
connectToDb();
module.exports = app;
