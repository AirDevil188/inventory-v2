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
    genre: undefined,
  });
});

const createGenreFormPost = [
  validateGenre,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
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

const deleteGenreGet = asyncHandler(async (req, res, next) => {
  const genre = await db.getGenreDetails(req.params.id);
  const games = await db.getGenreGames(req.params.id);

  if (!genre) {
    const err = new Error("Genre not found!");
    err.status = 404;
    return next(err);
  }

  res.render("genre_delete", {
    title: "Delete",
    genre: genre,
    games: games,
  });
});

const deleteGenrePost = asyncHandler(async (req, res, next) => {
  const genre = await db.getGenreDetails(req.params.id);
  const games = await db.getGenreGames(req.params.id);

  if (games.length) {
    res.render("genre_detail", {
      title: "Delete Genre",
      genre: genre,
      games: games,
    });
    return;
  }
  await db.deleteGenre(req.params.id);
  res.redirect("/");
});

const updateGenreGet = asyncHandler(async (req, res, next) => {
  const genre = await db.getGenreDetails(req.params.id);

  res.render("genre_form", {
    title: "Update Genre",
    genre: genre,
  });
});

const updateGenrePost = [
  validateGenre,
  asyncHandler(async (req, res, next) => {
    const genre = await db.getGenreDetails(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
    }
    const { name } = req.body;
    await db.updateGenre(req.params.id, name);
    res.redirect("/");
  }),
];
module.exports = {
  getGenres,
  getGenreDetails,
  createGenreFormGet,
  createGenreFormPost,
  deleteGenreGet,
  deleteGenrePost,
  updateGenreGet,
  updateGenrePost,
};
