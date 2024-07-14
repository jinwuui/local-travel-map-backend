const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.SEQUELIZE_STORAGE,
  logging: false,
});

module.exports = sequelize;
