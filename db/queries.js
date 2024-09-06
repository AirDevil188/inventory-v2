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

async function getPlatformDetails(id) {
  const { rows } = await pool.query(
    `
    SELECT 
    platform.name as platform_name,
    platform.url as platform_url
    FROM platform
    WHERE platform.id = $1`,
    [id]
  );

  return rows[0];
}

async function getPlatformGames(id) {
  const { rows } = await pool.query(
    `
    SELECT 
      game.title as game_title,
      game.url as game_url
    FROM game
    INNER JOIN game_platform
    ON game_id = game.id
    WHERE  platform_id = $1 `,
    [id]
  );

  return rows;
}

async function getGenres() {
  const { rows } = await pool.query("SELECT name, id FROM genre");
  return rows;
}

async function getGenreDetails(id) {
  const { rows } = await pool.query(
    `SELECT 
    genre.name as genre_name, 
    genre.url as genre_url
    FROM genre
    WHERE genre.id = $1`,
    [id]
  );

  return rows[0];
}

async function getGenreGames(id) {
  const { rows } = await pool.query(
    `
    SELECT title as game_title, genre as game_genre, url as game_url
    FROM game
      WHERE genre =  $1;
    `,
    [id]
  );
  return rows;
}

async function getGameDetails(id) {
  try {
    const { rows } = await pool.query(
      `
            SELECT 
            game.title as game_title, game.publisher as game_publisher,
            game.url as game_url,
            developer.name as game_developer, genre.name as game_genre,
            game.date_of_release as game_release_date, publisher.name as game_publisher,
            game.developer as game_developer_id, game.publisher as game_publisher_id,
            game.genre as game_genre_id
            from game
            LEFT JOIN publisher
            ON publisher.id = game.publisher
            INNER JOIN developer
            ON developer.id =  game.developer
            INNER JOIN genre
            ON genre.id = game.genre
            WHERE game.id = $1`,
      [id]
    );

    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function getGameFoundedDate(id) {
  const { rows } = await pool.query(
    "SELECT to_char(date_of_release, 'YYYY-DD-MM') from game WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function getGamePlatform(id) {
  const { rows } = await pool.query(
    `SELECT platform.name as platform_name, platform_id  
        FROM platform
        INNER JOIN game_platform
        ON platform.id = platform_id
        WHERE game_id = $1
        `,
    [id]
  );
  return rows[0];
}

async function insertGame(
  title,
  publisher,
  developer,
  platforms,
  genre,
  date_of_release
) {
  await pool.query(
    `
CREATE OR REPLACE FUNCTION insert_game(title VARCHAR(255), publisher TEXT, developer INT, genre INT, date_of_release DATE) RETURNS void
   LANGUAGE plpgsql AS
   $$BEGIN
      INSERT INTO game(title, publisher, developer, genre, date_of_release) VALUES($1, CAST (NULLIF($2, '') AS INT), $3, $4, $5);
      EXCEPTION
        WHEN unique_violation THEN
          RAISE EXCEPTION 'Game already exists!'
            USING DETAIL = 'Game already exists!!';
      
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

  const selectedGame = await pool.query(
    `
      SELECT id FROM game
      WHERE title = $1
      AND developer = $2
      `,
    [title, developer]
  );

  insertGamePlatform(selectedGame.rows[0].id, platforms);
}

async function updateGame(
  id,
  title,
  publisher,
  developer,
  genre,
  date_of_release
) {
  try {
    await pool.query(
      `
      CREATE OR REPLACE FUNCTION update_game(number INTEGER, title VARCHAR(255), publisher TEXT, developer INTEGER, genre INT, date_of_release DATE) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
          UPDATE game
          SET title = $2,
              publisher = CAST (NULLIF($3, '') AS INT),
              developer = $4,
              genre = $5,
              date_of_release = $6
                WHERE id = $1;
          END; $$;
      `
    );

    const { rows } = await pool.query(
      "SELECT update_game($1, $2, $3, $4, $5, $6)",
      [id, title, publisher, developer, genre, date_of_release]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function insertPublisher(name, location, founded, closed) {
  await pool.query(`
    CREATE OR REPLACE FUNCTION insert_publisher(name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN) RETURNS VOID
      LANGUAGE plpgsql AS
        $$BEGIN
          INSERT INTO publisher(name, location, founded, closed) VALUES ($1, $2, $3, $4);
            EXCEPTION
              WHEN unique_violation THEN
                RAISE EXCEPTION 'Publisher already exists!'
                  USING DETAIL = 'Publisher already exists!';
        END; $$;
    `);

  await pool.query("SELECT insert_publisher($1, $2, $3, $4)", [
    name,
    location,
    founded,
    closed,
  ]);
}

async function updatePublisher(id, name, location, founded, closed) {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_publisher(number INTEGER, name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN)
      RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            UPDATE publisher
            SET name = $2,
                location = $3,
                founded = $4,
                closed = $5
                  WHERE id = $1;
          END; $$;  
      `);

    const { rows } = await pool.query(
      "SELECT update_publisher($1, $2, $3, $4, $5)",
      [id, name, location, founded, closed]
    );
    return rows[0], da;
  } catch (e) {
    console.log(e);
  }
}

async function getPublisherDevelopers(id) {
  const { rows } = await pool.query(
    `
    SELECT
      developer.name as developer_name,
      developer.publisher as developer_publisher,
      developer.url as developer_url
    FROM developer
      WHERE developer.publisher = $1;
        `,
    [id]
  );
  return rows;
}

async function getPublisherGames(id) {
  const { rows } = await pool.query(
    `
  SELECT
    game.title as game_title,
    game.url as game_url
    FROM game
      WHERE game.publisher = $1;
      `,
    [id]
  );
  return rows;
}

async function deletePublisher(id) {
  try {
    await pool.query(`
       CREATE OR REPLACE FUNCTION delete_publisher(number INTEGER) RETURNS VOID
    LANGUAGE plpgsql AS
      $$BEGIN
        delete FROM publisher WHERE id = $1;
          EXCEPTION
            WHEN foreign_key_violation THEN
              RAISE EXCEPTION 'Publisher contains developers or games entries before deleting this publisher please delete developers  or games that are associated with it!';
      END; $$;
      `);

    const { rows } = await pool.query("SELECT delete_publisher($1)", [id]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function deleteGame(id) {
  try {
    await pool.query(
      `
       CREATE OR REPLACE FUNCTION delete_game(number INTEGER) RETURNS VOID
    LANGUAGE plpgsql AS
      $$BEGIN
        delete FROM game WHERE id = $1;
      END; $$;
      `
    );

    const { rows } = await pool.query("SELECT delete_game($1)", [id]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function deleteGamePlatform(id) {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION delete_game_platform(number INTEGER) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            delete FROM game_platform WHERE game_id = $1;
          END; $$;

      `);

    const { rows } = await pool.query("SELECT delete_game_platform($1)", [id]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function getPublisherDetails(id) {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        name as publisher_name,
        publisher.url as publisher_url,
        location as publisher_location,
        founded as publisher_date_of_foundation,
        closed as publisher_close_status
          FROM publisher
            WHERE id = $1;
      `,
      [id]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function getPublisherFoundedDate(id) {
  try {
    const { rows } = await pool.query(
      `
      SELECT to_char(founded, 'YYYY-DD-MM') from publisher WHERE id = $1;`,
      [id]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function insertDeveloper(name, location, founded, closed, publisher) {
  await pool.query(`
          CREATE OR REPLACE FUNCTION insert_developer(name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN, publisher TEXT) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            INSERT INTO developer(name, location, founded, closed, publisher) VALUES ($1, $2, $3, $4, CAST  (NULLIF($5, '') AS INT));
            EXCEPTION
                WHEN unique_violation THEN
                   RAISE EXCEPTION 'Developer already exists!'
                      USING DETAIL = 'Developer already exists!';


          END; $$;
      `);

  await pool.query("SELECT insert_developer($1, $2, $3, $4, $5)", [
    name,
    location,
    founded,
    closed,
    publisher,
  ]);
}

async function updateDeveloper(id, name, location, founded, closed, publisher) {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_developer(number INTEGER, name VARCHAR(255), location VARCHAR(255), founded DATE, closed BOOLEAN, publisher TEXT) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
          UPDATE developer
          SET name = $2,
              location = $3,
              founded = $4,
              closed = $5,
              publisher = CAST (NULLIF($6, '') AS INT)
                WHERE id = $1;
          END; $$;
      `);

    const { rows } = await pool.query(
      "SELECT update_developer($1, $2, $3, $4, $5, $6)",
      [id, name, location, founded, closed, publisher]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function deleteDeveloper(id) {
  try {
    await pool.query(`
  CREATE OR REPLACE FUNCTION delete_developer(number INTEGER) RETURNS VOID
    LANGUAGE plpgsql AS
      $$BEGIN
      delete FROM developer where id = $1;
        EXCEPTION
          WHEN foreign_key_violation THEN
          RAISE EXCEPTION 'Developer contains games entries before deleting this developer please delete games that are associated with it!';
      END; $$;
  `);
  } catch (e) {
    console.log(e);
  }

  const { rows } = await pool.query("SELECT delete_developer($1)", [id]);
  return rows[0];
}

async function getDeveloperGames(id) {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
      game.title as game_title,
      game.url as game_url,
      game.developer as game_developer
        FROM game
        WHERE game.developer = $1;

      `,
      [id]
    );
    return rows;
  } catch (e) {
    console.log(e);
  }
}

async function getDeveloperDetails(id) {
  try {
    const { rows } = await pool.query(
      `
        SELECT developer.name as developer_name,
               developer.url as developer_url,
               developer.location as developer_location,
               developer.founded as developer_date_of_foundation,
               developer.closed as developer_status,
               developer.publisher as developer_publisher,
               publisher.name as publisher_name 
                FROM developer
                  LEFT JOIN publisher
                    ON developer.publisher = publisher.id
                      WHERE developer.id = $1;

        `,
      [id]
    );

    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function getDeveloperFoundedDate(id) {
  try {
    const { rows } = await pool.query(
      `
      SELECT to_char(founded, 'YYYY-DD-MM') from developer WHERE id = $1;`,
      [id]
    );
    return rows[0];
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

async function insertGenre(name) {
  await pool.query(`
      CREATE OR REPLACE FUNCTION insert_genre(name VARCHAR(255)) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            INSERT INTO genre(name) VALUES ($1);
              EXCEPTION
                WHEN unique_violation THEN
                  RAISE EXCEPTION 'Genre already exists!'
                    USING DETAIL = 'Genre already exists!';
          END; $$;
      `);

  await pool.query(`SELECT insert_genre($1)`, [name]);
}

async function deleteGenre(id) {
  try {
    await pool.query(`
  CREATE OR REPLACE FUNCTION delete_genre(number INTEGER) RETURNS VOID
    LANGUAGE plpgsql AS
      $$BEGIN
        delete FROM genre WHERE id = $1;
          EXCEPTION
            WHEN foreign_key_violation THEN
              RAISE EXCEPTION 'Genre contains games, before deleting this genre please delete games that are associated with it!';
      END; $$;
  `);

    const { rows } = await pool.query(`SELECT delete_genre($1)`, [id]);

    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function updateGenre(id, name) {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_genre(number INTEGER, name VARCHAR(255)) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            UPDATE genre
            SET name = $2
            WHERE id = $1;
          END; $$;
    
      `);

    const { rows } = pool.query("SELECT update_genre($1, $2)", [id, name]);

    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function insertPlatform(name) {
  await pool.query(
    `
       CREATE OR REPLACE FUNCTION insert_platform(name VARCHAR(255)) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            INSERT INTO platform(name) VALUES ($1);
              EXCEPTION
                WHEN unique_violation THEN
                  RAISE EXCEPTION 'Platform already exists!'
                    USING DETAIL = 'Platform already exists!';
          END; $$;
`
  );

  await pool.query(
    `
      SELECT insert_platform($1)`,
    [name]
  );
}

async function deletePlatform(id) {
  try {
    await pool.query(`
      CREATE OR REPLACE FUNCTION delete_platform(number INTEGER) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
          delete FROM platform WHERE id = $1;
            EXCEPTION
              WHEN foreign_key_violation THEN
                RAISE EXCEPTION 'Platform contains games, before deleting this platform please delete games that are associated with it!';
          END; $$;

      `);

    const { rows } = await pool.query("SELECT delete_platform($1)", [id]);
    return rows[0];
  } catch (e) {
    console.log(e);
  }
}

async function updatePlatform(id, name) {
  try {
    await pool.query(
      `CREATE OR REPLACE FUNCTION update_platform(number INTEGER, name VARCHAR(255)) RETURNS VOID
        LANGUAGE plpgsql AS
          $$BEGIN
            UPDATE platform
              SET name = $2
              WHERE id = $1;
          END; $$;
      `
    );
    const { rows } = await pool.query("SELECT update_platform($1, $2)", [
      id,
      name,
    ]);
    return rows[0];
  } catch (e) {
    console.log(e);
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
  getPublisherFoundedDate,
  getPublisherDevelopers,
  getPublisherGames,
  getDevelopers,
  getDeveloperDetails,
  getDeveloperFoundedDate,
  getDeveloperGames,
  getPlatforms,
  getPlatformDetails,
  getPlatformGames,
  getGenres,
  getGenreDetails,
  getGenreGames,
  getGamePlatform,
  getGameDetails,
  getGameFoundedDate,
  insertGame,
  updateGame,
  deleteGame,
  deleteGamePlatform,
  insertPublisher,
  updatePublisher,
  deletePublisher,
  insertDeveloper,
  updateDeveloper,
  deleteDeveloper,
  insertGenre,
  updateGenre,
  deleteGenre,
  insertPlatform,
  updatePlatform,
  deletePlatform,
};
