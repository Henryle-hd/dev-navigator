const path = require("path");
const bcrypt = require("bcrypt");
const Users = require("../modules/users.model");

// signup
const signup = async (req, res) => {
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

    const addedUser = await Users.create(newUser);
    const user = await Users.findOne({ email });
    //set session data,
    req.session.userId = user._id;
    req.session.userRole = user.role;
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

//login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .sendFile(
          path.join(__dirname, "../public/login/login-failed/index.html")
        );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .sendFile(
          path.join(__dirname, "../public/login/login-failed/index.html")
        );
    }

    //set session data,
    req.session.userId = user._id;
    req.session.userRole = user.role;
    res
      .status(200)
      .sendFile(path.join(__dirname, "../protected/add-resources/index.html"));
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .sendFile(path.join(__dirname, "../../public/500/index.html"));
  }
};

//add resource
const addResource = (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "../protected/add-resources/index.html"));
};
module.exports = {
  signup,
  login,
  addResource
};
