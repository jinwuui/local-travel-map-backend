const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Feedback = sequelize.define("Feedback", {
  feedbackId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  writer: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Feedback;
