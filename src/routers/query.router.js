const express = require("express");
const searchResources = require("../controllers/query.controllers");
const router = express.Router();

//query
router.route("/").get(searchResources);

module.exports = router;
