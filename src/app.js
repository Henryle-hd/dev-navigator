const express = require("express");
const connectToDb = require("../config/database");
const routerResources = require("./routers/resources.router");
const routerQuery = require("./routers/query.router");
const User = require("./modules/users.model");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//router
app.use("/api/resources", routerResources);
app.use("/api/v1/query", routerQuery);

//static
app.use(express.static("public"));

app.post("/userreg", async (req, res) => {
  const { email, password } = req.body;
  const username = email.split("@")[0];
  try {
    //hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username,
      email,
      password: hashedPassword
    };

    const addedUser = await User.create(newUser);
    res
      .status(201)
      .sendFile(
        path.join(__dirname, "../public/singup/reg-success/index.html")
      );
    console.log("user added done!"); //test
  } catch (error) {
    res.status(500).send(`"error during reg", ${error}`);
  }
});
//page not found
app.all("*", (req, res) => {
  res.status(404).sendFile("404/index.html", { root: "./public" });
  console.log("page not done!"); //test
});
connectToDb();
module.exports = app;
