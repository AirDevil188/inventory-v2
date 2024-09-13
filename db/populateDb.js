const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const SQL = `

CREATE TABLE IF NOT EXISTS platform(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, url TEXT GENERATED ALWAYS AS ('/games/game' || id::text) STORED); 

CREATE TABLE IF NOT EXISTS genre(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, url TEXT GENERATED ALWAYS AS ('/genres/genre/' || id::text) STORED); 

CREATE TABLE IF NOT EXISTS publisher (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, location VARCHAR(255), founded DATE, closed BOOLEAN, url TEXT GENERATED ALWAYS AS ('/publishers/publisher/' || id::text) STORED);

CREATE TABLE IF NOT EXISTS developer (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name VARCHAR(255) UNIQUE, location VARCHAR(255), founded DATE, closed BOOLEAN, publisher INTEGER REFERENCES publisher(id), url TEXT generated ALWAYS AS ('/developers/developer/' || id::text) STORED);

CREATE TABLE IF NOT EXISTS game 
(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title VARCHAR(255) UNIQUE, 
 developer INTEGER REFERENCES developer(id), publisher INTEGER REFERENCES publisher(id),
  platform INTEGER REFERENCES platform(id), 
  genre INTEGER REFERENCES genre(id),
   date_of_release DATE,
   url TEXT GENERATED ALWAYS AS ('/games/game/' || id::text) STORED); 

CREATE TABLE IF NOT EXISTS game_platform (game_id INTEGER REFERENCES game(id), platform_id INTEGER REFERENCES platform(id));
 




`;

async function mainDriver() {
  console.log("sending information...");
  const client = new Client({
    connectionString: process.env.EXTERNAL_DB_CONNECTION_STRING,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
  console.log(client);
}

mainDriver();
