const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

module.exports = new Pool({
  connectionString:
    process.env.STATUS === "local"
      ? process.env.LOCAL_DB_CONNECTION_STRING
      : process.env.EXTERNAL_DB_CONNECTION_STRING,
});
