const asyncHandler = require("express-async-handler");
const db = require("../db/queries");

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
    games: games,
    publishers: publishers,
    developers: developers,
    platforms: platforms,
    genres: genres,
  });
});

module.exports = {
  getIndex,
  navLinks,
};
