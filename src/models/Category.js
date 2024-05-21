const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Category = sequelize.define("Category", {
  categoryId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Category;
