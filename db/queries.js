const pool = require("../db/pool");

async function countGames() {
  const { rows } = await pool.query("SELECT COUNT(id) FROM game");
  return rows[0].count;
}

async function countPublishers() {
  const { rows } = await pool.query("SELECT COUNT(id) FROM publisher");
  return rows[0].count;
}

async function countDevelopers() {
  const { rows } = await pool.query("SELECT COUNT(id) FROM developer");
  return rows[0].count;
}

async function countPlatforms() {
  const { rows } = await pool.query("SELECT COUNT(id) FROM platform");
  return rows[0].count;
}

async function countGenres() {
  const { rows } = await pool.query("SELECT COUNT (id) FROM genre");
  return rows[0].count;
}

async function getGames() {
  const { rows } = await pool.query("SELECT title, id FROM game");
  return rows;
}

async function getPublishers() {
  const { rows } = await pool.query("SELECT  name, id FROM publisher");
  return rows;
}

async function getDevelopers() {
  const { rows } = await pool.query("SELECT name, id FROM developer");
  return rows;
}

async function getPlatforms() {
  const { rows } = await pool.query("SELECT name, id FROM platform");
  return rows;
}

async function getGenres() {
  const { rows } = await pool.query("SELECT name, id FROM genre");
  return rows;
}

async function getGameDetails(id) {
  try {
    const { rows } = await pool.query(`
            SELECT 
            game.title as game_title, game.publisher as game_publisher, 
            developer.name as game_developer, genre.name as game_genre,
            game.date_of_release as game_release_date, publisher.name as game_publisher
            from game
            INNER JOIN publisher
            ON publisher.id = game.publisher
            INNER JOIN developer
            ON developer.id =  game.developer
            INNER JOIN genre
            ON genre.id = game.genre
            WHERE game.id = '${id}'`);

    return rows[0];
  } catch (e) {
    console.log(e);
  }
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
      `
    INSERT INTO game(title, publisher, developer, genre, date_of_release) VALUES($1, $2, $3, $4, $5)
    `,
      [title, publisher, developer, genre, date_of_release]
    );
  } catch (e) {
    console.log(e);
  }
  const selectedGame = await pool.query(
    `
      SELECT id FROM game
      WHERE title = '${title}'
      AND developer = '${developer}'
      `
  );

  insertGamePlatform(selectedGame.rows[0].id, platforms);
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

async function insertGenre(name) {
  try {
    await pool.query("INSERT INTO genre(name) VALUES ($1)", [name]);
  } catch (e) {
    return console.log(e);
  }
}

async function insertPlatform(name) {
  try {
    await pool.query("INSERT INTO platform(name) VALUES ($1)", [name]);
  } catch (e) {
    return console.log(e);
  }
}

module.exports = {
  countGames,
  countPublishers,
  countDevelopers,
  countPlatforms,
  countGenres,
  getGames,
  getPublishers,
  getDevelopers,
  getPlatforms,
  getGenres,
  getGamePlatform,
  getGameDetails,
  insertGame,
  insertGenre,
  insertPlatform,
};
