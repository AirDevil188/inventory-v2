const pool = require("../db/pool");

async function getPublishers() {
  const { rows } = await pool.query("SELECT id, name FROM publisher");
  return rows;
}

async function getDevelopers() {
  const { rows } = await pool.query("SELECT id, name FROM developer");
  return rows;
}

async function getPlatforms() {
  const { rows } = await pool.query("SELECT * FROM platform");
  return rows;
}

async function getGamePlatform(id) {
  const { rows } = await pool.query(`SELECT platform.name as platform_name 
        FROM platform
        INNER JOIN game_platform
        ON platform.id = platform_id
        WHERE game_id = '${id}'
        `);
  return rows;
}

async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genre");
  return rows;
}

async function insertGame(
  title,
  publisher,
  developer,
  platforms,
  genre,
  date_of_release
) {
  try {
    await pool.query(
      "INSERT INTO game(title, publisher, developer, genre, date_of_release) VALUES($1, $2, $3, $4, $5)",
      [title, publisher, developer, genre, date_of_release]
    );
    const selectedGame = await pool.query(
      `
      SELECT id FROM game
      WHERE title = '${title}'
      AND developer = '${developer}'
      `
    );
    insertGamePlatform(selectedGame.rows[0].id, platforms);
    console.log(selectedGame.rows[0].id);
  } catch (e) {
    console.log(e);
  }
}

async function insertGamePlatform(gameid, platforms) {
  for (let i = 0; i < platforms.length; i++) {
    try {
      await pool.query(
        "INSERT INTO game_platform(game_id, platform_id) VALUES ($1, $2)",
        [gameid, platforms[i]]
      );
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = {
  getPublishers,
  getDevelopers,
  getPlatforms,
  getGenres,
  getGamePlatform,
  insertGame,
};
