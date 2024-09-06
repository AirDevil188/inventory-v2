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
    platform: undefined,
  });
});

const postCreatePlatformForm = [
  validatePlatform,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("platform_form", {
        title: "Create Platform",
        platform: undefined,
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    try {
      await db.insertPlatform(name);
      res.redirect("/");
    } catch (e) {
      return res.status(400).render("platform_form", {
        title: "Create Platform",
        platform: undefined,
        errors: [...[errors], { msg: e.detail }],
      });
    }
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

  if (games.length > 0) {
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

const getUpdatePlatform = asyncHandler(async (req, res, next) => {
  const platform = await db.getPlatformDetails(req.params.id);

  res.render("platform_form", {
    title: "Update Platform",
    platform: platform,
  });
});

const postUpdatePlatform = [
  validatePlatform,
  asyncHandler(async (req, res, next) => {
    const platform = await db.getPlatformDetails(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("platform_form", {
        title: "Update Platform",
        platform: platform,
        errors: errors.array(),
      });
    }
    const { name } = req.body;
    await db.updatePlatform(req.params.id, name);
    res.redirect("/");
  }),
];

module.exports = {
  getPlatforms,
  getPlatformDetails,
  getCreatePlatformForm,
  postCreatePlatformForm,
  getDeletePlatform,
  postDeletePlatform,
  getUpdatePlatform,
  postUpdatePlatform,
};
