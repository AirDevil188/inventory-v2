const { Client } = require("pg");

const SQL = `

CREATE TABLE IF NOT EXISTS platform(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE); 

CREATE TABLE IF NOT EXISTS genre(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE); 

CREATE TABLE IF NOT EXISTS publisher (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, location VARCHAR(255), founded DATE, closed BOOLEAN);

CREATE TABLE IF NOT EXISTS developer (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, location VARCHAR(255), founded DATE, closed BOOLEAN, publisher INTEGER REFERENCES publisher(id));

CREATE TABLE IF NOT EXISTS game 
(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title VARCHAR(255) UNIQUE, 
 developer INTEGER REFERENCES developer(id), publisher INTEGER REFERENCES publisher(id),
  platform INTEGER REFERENCES platform(id), 
  genre INTEGER REFERENCES genre(id),
   date_of_release DATE); 

CREATE TABLE IF NOT EXISTS game_developer (game_id INTEGER REFERENCES game(id), platform_id INTEGER REFERENCES platform(id));
 




`;

async function mainDriver() {
  console.log("sending information...");
  const client = new Client({
    connectionString:
      process.env.STATUS === "production"
        ? process.env.EXTERNAL_DB_CONNECTION_STRING
        : process.env.LOCAL_DB_CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

mainDriver();
