const express = require("express");
const {
  getResources,
  addResources,
  getResource,
  updateResource,
  deleteResource
} = require("../controllers/resources.controllers");
const router = express.Router();

//get & post resources
router.route("/").get(getResources).post(addResources);

//get a resource & update & delete resources
router
  .route("/:id")
  .get(getResource)
  .put(updateResource)
  .delete(deleteResource);

module.exports = router;
