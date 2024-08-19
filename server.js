require("dotenv").config();
const app = require("./src/app");
const port = process.env.SERVER_PORT_NUMBER;

app.listen(port, () => {
  console.log(`site url: http://localhost:${port}`);
});
