const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const PlaceCategories = sequelize.define("PlaceCategories");

module.exports = PlaceCategories;
