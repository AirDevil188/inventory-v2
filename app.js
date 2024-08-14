const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config();

const indexRouter = require("./routes/indexRouter");
const PORT = process.env.PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

app.use((req, res, next, err) => {
  console.error(err);
  return res.status(500).send(err);
});

app.listen(PORT, () => console.log(`App is listening on the ${PORT}`));
