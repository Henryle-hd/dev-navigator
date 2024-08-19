const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../modules/users.model");

// post user
const createUser = async (req, res) => {
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
        path.join(__dirname, "../../public/singup/reg-success/index.html")
      );
    console.log("user added done!"); //test
  } catch (error) {
    res.status(500).send(`"error during reg", ${error}`);
  }
};
module.exports = {
  createUser
};
