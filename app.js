const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config();

const indexRouter = require("./routes/indexRouter");
const gameRouter = require("./routes/gameRouter");
const publisherRouter = require("./routes/publisherRouter");
const developerRouter = require("./routes/developerRouter");
const platformRouter = require("./routes/platformRouter");
const genreRouter = require("./routes/genreRouter");

const PORT = process.env.PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/games", gameRouter);
app.use("/publishers", publisherRouter);
app.use("/developers", developerRouter);
app.use("/genres", genreRouter);
app.use("/platforms", platformRouter);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send(err);
});

app.listen(PORT, () => console.log(`App is listening on the ${PORT}`));
