const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Announcement = sequelize.define("Announcement", {
  announcementId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Announcement;
