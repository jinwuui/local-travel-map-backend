const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const UserPlaces = sequelize.define("UserPlaces", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users", // 테이블 이름
      key: "user_id",
    },
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "places", // 테이블 이름
      key: "place_id",
    },
  },
});

module.exports = UserPlaces;
