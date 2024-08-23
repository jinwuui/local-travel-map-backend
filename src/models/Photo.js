const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Photo = sequelize.define("Photo", {
  photoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "places", // 테이블 이름
      key: "place_id",
    },
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Photo;
