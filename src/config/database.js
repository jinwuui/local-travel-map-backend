const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/Users/jinwoo/localtravel.db",
  logging: console.log,
});

module.exports = sequelize;
