const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

module.exports = {
  getIndex,
};
