const path = require("path");

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res
      .status(401)
      .sendFile(path.join(__dirname, "../../public/login/index.html"));
  }
};
module.exports = isAuthenticated;
