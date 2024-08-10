require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.db_uri;
const connectToDb = () => {
  mongoose
    .connect(url)
    .then(() => {
      console.log("connected to db 🫂!");
    })
    .catch((Error) => {
      console.error("Error connecting to MongoDB:", Error);
    });
};
module.exports = connectToDb;
