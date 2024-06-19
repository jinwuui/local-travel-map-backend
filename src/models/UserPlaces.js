const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const UserPlaces = sequelize.define("UserPlaces");

module.exports = UserPlaces;
