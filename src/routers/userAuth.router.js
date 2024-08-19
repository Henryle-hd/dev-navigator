const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userAuth.controllers");
//add user
router.route("/signup").post(createUser);
module.exports = router;
