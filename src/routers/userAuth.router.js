const isAuthenticated = require("../middleware/auth.middleware");
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  addResource
} = require("../controllers/userAuth.controllers");

//add user
router.route("/signup").post(signup);
//login user
router.route("/login").post(login);
//create resources
router.route("/add-resource").get(isAuthenticated, addResource);

module.exports = router;
