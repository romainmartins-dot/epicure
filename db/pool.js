const { Pool } = require("pg");
module.exports = new Pool({ database: process.env.DB_NAME || "raisin_db" });
