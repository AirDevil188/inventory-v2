const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "must contain at least one character.";

const validateGenre = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Genre ${lengthErr}`),
];

const getGenres = asyncHandler(async (req, res, next) => {
  const genres = await db.getGenres();

  res.render("genres", {
    title: "All Genres",
    genres: genres,
  });
});

const getGenreDetails = asyncHandler(async (req, res, next) => {
  const genre = await db.getGenreDetails(req.params.id);
  const games = await db.getGenreGames(req.params.id);

  if (!genre) {
    const err = new Error("Genre not found!");
    err.status = 404;
    return next(err);
  }

  res.render("genre_detail", {
    title: "Genre Detail",
    genre: genre,
    games: games,
  });
});

const createGenreFormGet = asyncHandler(async (req, res, next) => {
  res.render("genre_form", {
    title: "Create Genre",
  });
});

const createGenreFormPost = [
  validateGenre,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).render("genre_form", {
        title: "Create Genre",
        errors: errors.array(),
      });
    }

    const { name } = req.body;

    await db.insertGenre(name);
    res.redirect("/");
  }),
];

module.exports = {
  getGenres,
  getGenreDetails,
  createGenreFormGet,
  createGenreFormPost,
};
