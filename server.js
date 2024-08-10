require("dotenv").config();
const app = require("./src/app");
const port = process.env.SERVER_PORT_NUMBER;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
