const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "must contain at least one character.";
const selectionErr = "must be selected.";

const validateGame = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Game Title ${lengthErr}`),

  body("developer")
    .trim()
    .notEmpty()
    .withMessage(`Game Developer ${selectionErr}`),
  body("platforms")
    .trim()
    .notEmpty()
    .withMessage(`Game Platform ${selectionErr}`),
  body("genre").trim().notEmpty().withMessage(`Game Genre ${selectionErr}`),
  body("date_of_release")
    .trim()
    .notEmpty()
    .withMessage(`Game Release Date ${selectionErr}`),
];

const getGames = asyncHandler(async (req, res, next) => {
  const games = await db.getGames();

  res.render("games", {
    title: "All Games",
    games: games,
  });
});

const getGameDetail = asyncHandler(async (req, res, next) => {
  const [game, platforms] = await Promise.all([
    db.getGameDetails(req.params.id),
    db.getGamePlatform(req.params.id),
  ]);
  console.log(game);

  if (!game) {
    const err = new Error("Game not found!");
    err.status = 404;
    return next(err);
  }

  console.log(game);
  console.log(platforms);
  res.render("game_detail", {
    title: "Game Detail",
    game: game,
    platforms: platforms,
  });
});

const getCreateGameForm = asyncHandler(async (req, res, next) => {
  const [publishers, developers, platforms, genres] = await Promise.all([
    db.getPublishers(),
    db.getDevelopers(),
    db.getPlatforms(),
    db.getGenres(),
  ]);

  res.render("game_form", {
    title: "Add new Game",
    publishers: publishers,
    developers: developers,
    platforms: platforms,
    genres: genres,
  });
});

const postCreateGameForm = [
  validateGame,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [publishers, developers, platforms, genres] = await Promise.all([
        db.getPublishers(),
        db.getDevelopers(),
        db.getPlatforms(),
        db.getGenres(),
      ]);

      return res.status(400).render("game_form", {
        title: "Add new Game",
        publishers: publishers,
        developers: developers,
        platforms: platforms,
        genres: genres,
        errors: errors.array(),
      });
    }

    const { title, publisher, developer, platforms, genre, date_of_release } =
      req.body;

    await db.insertGame(
      title,
      publisher,
      developer,
      platforms,
      genre,
      date_of_release
    );

    res.redirect("/");
  }),
];

module.exports = {
  getGames,
  getCreateGameForm,
  getGameDetail,
  postCreateGameForm,
};
