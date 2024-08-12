const pool = require("../db/pool");

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
module.exports = {
  getPublishers,
  getDevelopers,
  getPlatforms,
  getGenres,
};
