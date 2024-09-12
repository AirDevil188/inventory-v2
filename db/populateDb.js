const { Client } = require("pg");

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
    connectionString:
      "postgres://inventory-app-v2-main-db-0107bfc3cc38e886f:7zVvE4bcNaDKXBEJyyVejRw5zBh8F9@user-prod-us-east-2-1.cluster-cfi5vnucvv3w.us-east-2.rds.amazonaws.com:5432/inventory-app-v2-main-db-0107bfc3cc38e886f",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
  console.log(client);
}

mainDriver();
