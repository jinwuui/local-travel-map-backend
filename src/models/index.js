const sequelize = require("../config/database");

const Place = require("./Place");
const Photo = require("./Photo");
const Category = require("./Category");
const PlaceCategories = require("./PlaceCategories");
const User = require("./User");
const UserPlaces = require("./UserPlaces");

const Announcement = require("./Announcement");
const Feedback = require("./Feedback");

// 관계 설정
Place.hasMany(Photo, { foreignKey: "placeId" });
Photo.belongsTo(Place);

Place.belongsToMany(Category, { through: PlaceCategories });
Category.belongsToMany(Place, { through: PlaceCategories });

User.belongsToMany(Place, {
  through: UserPlaces,
  foreignKey: "userId",
  otherKey: "placeId",
});
Place.belongsToMany(User, {
  through: UserPlaces,
  foreignKey: "placeId",
  otherKey: "userId",
});

module.exports = {
  Photo,
  Place,
  Category,
  PlaceCategories,
  User,
  UserPlaces,
  Announcement,
  Feedback,
};
