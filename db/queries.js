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
            LEFT JOIN publisher
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
CREATE OR REPLACE FUNCTION insert_game(title VARCHAR(255), publisher TEXT, developer INT, genre INT, date_of_release DATE) RETURNS void
   LANGUAGE plpgsql AS
$$BEGIN
    INSERT INTO game(title, publisher, developer, genre, date_of_release) VALUES($1, CAST (NULLIF($2, '') AS INT), $3, $4, $5);
EXCEPTION
   WHEN unique_violation THEN
      RAISE EXCEPTION 'there is already a game with that title';
      
      END; $$;
`
    );
    await pool.query(`SELECT insert_game($1, $2, $3, $4, $5)`, [
      title,
      publisher,
      developer,
      genre,
      date_of_release,
    ]);
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

async function insertPublisher(name, location, founded, closed) {
  try {
    await pool.query(`
    CREATE OR REPLACE FUNCTION insert_publisher(name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN) RETURNS VOID
      LANGUAGE plpgsql AS
        $$BEGIN
          INSERT INTO publisher(name, location, founded, closed) VALUES ($1, $2, $3, $4);
            EXCEPTION
              WHEN unique_violation THEN
                RAISE EXCEPTION 'Publisher already exists!';
        END; $$;
    `);
  } catch (e) {
    console.log(e);
  }

  await pool.query("SELECT insert_publisher($1, $2, $3, $4)", [
    name,
    location,
    founded,
    closed,
  ]);
}

async function getPublisherDetails(id) {
  try {
    const { rows } = await pool.query(`
      SELECT 
        name as publisher_name,
        location as publisher_location,
        founded as publisher_date_of_foundation,
        closed as publisher_close_status
          FROM publisher
            WHERE id = ${id};
      `);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function insertDeveloper(name, location, founded, closed, publisher) {
  try {
    await pool.query(`
          CREATE OR REPLACE FUNCTION insert_developer(name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN, publisher TEXT) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            INSERT INTO developer(name, location, founded, closed, publisher) VALUES ($1, $2, $3, $4, CAST  (NULLIF($5, '') AS INT));
            EXCEPTION
                WHEN unique_violation THEN
                  RAISE EXCEPTION 'Developer already exists!';
          END; $$;
      `);
  } catch (e) {
    console.log(e);
  }

  await pool.query("SELECT insert_developer($1, $2, $3, $4, $5)", [
    name,
    location,
    founded,
    closed,
    publisher,
  ]);
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
    await pool.query(`
      CREATE OR REPLACE FUNCTION insert_genre(name VARCHAR(255)) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            INSERT INTO genre(name) VALUES ($1);
              EXCEPTION
                WHEN unique_violation THEN
                  RAISE EXCEPTION 'Genre already exists!';
          END; $$;
      `);

    await pool.query(`SELECT insert_genre($1)`, [name]);
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
  getPublisherDetails,
  getDevelopers,
  getPlatforms,
  getGenres,
  getGamePlatform,
  getGameDetails,
  insertGame,
  insertPublisher,
  insertDeveloper,
  insertGenre,
  insertPlatform,
};
