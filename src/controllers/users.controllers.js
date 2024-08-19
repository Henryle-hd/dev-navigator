const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../modules/users.model");

//get all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "user not found"
      });
    }
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error during get all user",
      error: error
    });
  }
};

//get specific user
const getSpecificUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found"
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error during get  user",
      error: error.message
    });
  }
};

//update user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    let updateDetails = {
      username,
      email
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateDetails.password = hashedPassword;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updateDetails, {
      new: true
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error during update  user",
      error: error.message
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res
      .status(200)
      .json({ success: true, message: "user delete successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error during update  user",
      error: error.message
    });
  }
};

module.exports = {
  getSpecificUser,
  getAllUsers,
  updateUser,
  deleteUser
};
