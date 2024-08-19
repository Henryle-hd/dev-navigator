const express = require("express");
const router = express.Router();
const {
  getSpecificUser,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/users.controllers");

//get all user
router.route("/").get(getAllUsers);

//get specific user, up update user and delete user
router.route("/:id").get(getSpecificUser).put(updateUser).delete(deleteUser);

module.exports = router;
