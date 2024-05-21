const sequelize = require("../config/database");

const Place = require("./Place");
const Photo = require("./Photo");
const Category = require("./Category");

// 관계 설정
Place.hasMany(Photo, { foreignKey: "placeId" });
Photo.belongsTo(Place);

Place.belongsToMany(Category, { through: "PlaceCategories" });
Category.belongsToMany(Place, { through: "PlaceCategories" });

module.exports = { Photo, Place, Category };
