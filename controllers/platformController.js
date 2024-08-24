const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const lengthErr = "must contain at least one character.";

const validatePlatform = [
  body("name").trim().isLength({ min: 1 }).withMessage(`Name ${lengthErr}`),
];

const getPlatforms = asyncHandler(async (req, res, next) => {
  const platforms = await db.getPlatforms();

  res.render("platforms", {
    title: "All Platforms",
    platforms: platforms,
  });
});

const getPlatformDetails = asyncHandler(async (req, res, next) => {
  const platform = await db.getPlatformDetails(req.params.id);
  const games = await db.getPlatformGames(req.params.id);

  if (!platform) {
    const err = new Error("Platform not found!");
    err.status = 404;
    return next(err);
  }

  res.render("platform_detail", {
    title: "Platform Details",
    platform: platform,
    games: games,
  });
});

const getCreatePlatformForm = asyncHandler(async (req, res, next) => {
  res.render("platform_form", {
    title: "Create Platform",
  });
});

const postCreatePlatformForm = [
  validatePlatform,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).render("platform_form", {
        title: "Create Platform",

        errors: errors.array(),
      });
    }

    const { name } = req.body;
    await db.insertPlatform(name);

    res.redirect("/");
  }),
];

const getDeletePlatform = asyncHandler(async (req, res, next) => {
  const platform = await db.getPlatformDetails(req.params.id);
  const games = await db.getPlatformGames(req.params.id);

  if (!platform) {
    const err = "Platform not found!";
    err.status = 404;
    return next(err);
  }

  res.render("platform_delete", {
    title: "Delete Platform",
    platform: platform,
    games: games,
  });
});

const postDeletePlatform = asyncHandler(async (req, res, next) => {
  const platform = await db.getPlatformDetails(req.params.id);
  const games = await db.getPlatformGames(req.params.id);

  if (games.length) {
    res.render("platform_delete", {
      title: "Delete Platform",
      platform: platform,
      games: games,
    });
    return;
  }

  await db.deletePlatform(req.params.id);
  res.redirect("/");
});

module.exports = {
  getPlatforms,
  getPlatformDetails,
  getCreatePlatformForm,
  postCreatePlatformForm,
  getDeletePlatform,
};
