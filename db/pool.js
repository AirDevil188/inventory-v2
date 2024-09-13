const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

module.exports = new Pool({
  connectionString: EXTERNAL_DB_CONNECTION_STRING,
});
