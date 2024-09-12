const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

module.exports = new Pool({
  connectionString:
    "postgres://inventory-app-v2-main-db-0107bfc3cc38e886f:7zVvE4bcNaDKXBEJyyVejRw5zBh8F9@user-prod-us-east-2-1.cluster-cfi5vnucvv3w.us-east-2.rds.amazonaws.com:5432/inventory-app-v2-main-db-0107bfc3cc38e886f",
});
