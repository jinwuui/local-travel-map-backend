const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Place = sequelize.define(
  "Place",
  {
    placeId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    hanguls: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chosungs: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alphabets: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["name"],
      },
    ],
  }
);

module.exports = Place;
