const pool = require("../db/pool");

async function getGames() {
  const { rows } = await pool.query(`
        SELECT 
            game.title as title,
            game.date_of_release as date_of_release,
            genre.name as genre,
            platform.name as platform,
            publisher.name as publisher,
            developer.name as developer
        FROM game
            INNER JOIN genre
                ON genre.id = game.id
            INNER JOIN platform
                ON platform.id = game.id
            INNER JOIN developer
                ON developer.id = game.id
            INNER JOIN publisher
                ON publisher.id = game.id
        `);
  return rows;
}

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

async function getGenres() {
  const { rows } = await pool.query("SELECT * FROM genre");
  return rows;
}

async function insertGame(
  title,
  publisher,
  developer,
  platform,
  genre,
  date_of_release
) {
  await pool.query(
    "INSERT INTO game(title, publisher, developer, platform, genre, date_of_release) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, publisher, developer, platform, genre, date_of_release]
  );
}
module.exports = {
  getGames,
  getPublishers,
  getDevelopers,
  getPlatforms,
  getGenres,
  insertGame,
};
