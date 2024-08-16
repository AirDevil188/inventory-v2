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

const navLinks = [
  {
    href: "/",
    text: "Homepage",
  },
  {
    href: "/games",
    text: "All Games",
  },
  {
    href: "/publishers",
    text: "All Publishers",
  },
  {
    href: "/developers",
    text: "All Developers",
  },
  {
    href: "/platforms",
    text: "All Platforms",
  },
  {
    href: "/genres",
    text: "All Genres",
  },
  {
    href: "/create-game",
    text: "Create Game",
  },
  {
    href: "/create-publisher",
    text: "Create Publisher",
  },
  {
    href: "/create-developer",
    text: "Create Developer",
  },
  {
    href: "/create-platform",
    text: "Create Platform",
  },
  {
    href: "/create-genre",
    text: "Create Genre",
  },
];

const getIndex = asyncHandler(async (req, res, next) => {
  const [games, publishers, developers, platforms, genres] = await Promise.all([
    db.countGames(),
    db.countPublishers(),
    db.countDevelopers(),
    db.countPlatforms(),
    db.countGenres(),
  ]);

  res.render("index", {
    title: "Homepage",
    navLinks: navLinks,
    games: games,
    publishers: publishers,
    developers: developers,
    platforms: platforms,
    genres: genres,
  });
});

const getGameDetail = asyncHandler(async (req, res, next) => {
  const [game, platforms] = await Promise.all([
    db.getGameDetails(req.params.id),
    db.getGamePlatform(req.params.id),
  ]);

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
    navLinks: navLinks,
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
    navLinks: navLinks,
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
        navLinks: navLinks,
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

const getDevelopers = asyncHandler(async (req, res, next) => {
  const developers = await db.getDevelopers();

  res.render("developers", {
    title: "All Developers",
    developers: developers,
    navLinks: navLinks,
  });
});

module.exports = {
  getIndex,
  getDevelopers,
  getCreateGameForm,
  getGameDetail,
  postCreateGameForm,
};
