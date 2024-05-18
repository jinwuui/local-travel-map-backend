const sequelize = require("../config/database");

const Place = require("./Place");
const Photo = require("./Photo");

// 관계 설정
Place.hasMany(Photo, { foreignKey: "placeId" });
Photo.belongsTo(Place);

module.exports = { Photo, Place };
