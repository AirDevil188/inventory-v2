const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

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
  res.render("index", { title: "Homepage", navLinks: navLinks });
});

const getCreateGameForm = asyncHandler(async (req, res, next) => {
  const publishers = await db.getPublishers();
  const developers = await db.getDevelopers();
  const platforms = await db.getPlatforms();
  const genres = await db.getGenres();

  res.render("gameForm", {
    title: "Add new Game",
    navLinks: navLinks,
    publishers: publishers,
    developers: developers,
    platforms: platforms,
    genres: genres,
  });
});

module.exports = {
  getIndex,
  getCreateGameForm,
};
