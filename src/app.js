require("dotenv").config();
const express = require("express");
const path = require("path");
const connectToDb = require("../config/database");
const session = require("express-session");
const routerResources = require("./routers/resources.router");
const routerQuery = require("./routers/query.router");
const routerUser = require("./routers/users.router");
const routerUserAth = require("./routers/userAuth.router");
const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);
//static
app.use(express.static("public"));

//router
app.use("/api/resources", routerResources);
app.use("/api/v1/query", routerQuery);
app.use("/api/users", routerUser);
app.use("/user", routerUserAth);

//page not found verification
app.all("*", (req, res) => {
  const filePath = req.url;
  if (filePath === "/blog/") {
    return res.sendFile("categories/blog/index.html", { root: "./public" });
  } else if (filePath === "/website/") {
    return res.sendFile("categories/website/index.html", { root: "./public" });
  } else if (filePath === "/book/") {
    return res.sendFile("categories/book/index.html", { root: "./public" });
  } else if (filePath === "/youtube%20channel/") {
    return res.sendFile("categories/youtube channel/index.html", {
      root: "./public"
    });
  }
  res.status(404).sendFile("404/index.html", { root: "./public" });
  console.log(filePath, ": page not done!"); //test
});
connectToDb();
module.exports = { app };
