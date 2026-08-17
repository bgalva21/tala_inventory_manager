const { Pool } = require("pg");

module.exports = new Pool({
  connectionString:"postgresql://btech:Coffeecup1998!@localhost:5432/inventory_app"
});
