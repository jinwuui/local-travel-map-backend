const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const UserPlaces = sequelize.define("UserPlaces", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users", // 'Users' should match the table name of your User model
      key: "userId",
    },
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Places", // 'Places' should match the table name of your Place model
      key: "placeId",
    },
  },
});

module.exports = UserPlaces;
