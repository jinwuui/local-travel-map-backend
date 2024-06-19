const sequelize = require("../config/database");

const Place = require("./Place");
const Photo = require("./Photo");
const Category = require("./Category");
const PlaceCategories = require("./PlaceCategories");
const User = require("./User");
const UserPlaces = require("./UserPlaces");

// 관계 설정
Place.hasMany(Photo, { foreignKey: "placeId" });
Photo.belongsTo(Place);

Place.belongsToMany(Category, { through: PlaceCategories });
Category.belongsToMany(Place, { through: PlaceCategories });

User.belongsToMany(Place, { through: UserPlaces });
Place.belongsToMany(User, { through: UserPlaces });

module.exports = { Photo, Place, Category, PlaceCategories, User, UserPlaces };
