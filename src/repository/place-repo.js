const Place = require("../models/Place");
const Category = require("../models/Category");
const UserPlaces = require("../models/UserPlaces");

const Utils = require("../utils/utils");
const GeoUtils = require("../utils/geoUtils");
const {
  disassembleHangul,
  disassembleHangulToGroups,
} = require("@toss/hangul");

module.exports = {
  async readPlacesWithCategories(whereClause, userId) {
    const places = await Place.findAll({
      attributes: ["placeId", "lat", "lng", "name"],
      include: [
        {
          model: Category,
          attributes: ["name"],
          where: whereClause["$Categories.name$"]
            ? { name: whereClause["$Categories.name$"] }
            : undefined,
        },
      ],
    });

    const placesWithCategories = await Promise.all(
      places.map(async (place) => {
        const categories = await place.getCategories();

        place.dataValues.categories = categories.map(
          (category) => category.name
        );

        // 로그인 상태일 경우 즐겨찾기 여부 확인
        if (userId) {
          const favorite = await UserPlaces.findOne({
            where: {
              userId: userId,
              placeId: place.placeId,
            },
          });
          place.dataValues.isFavorite = !!favorite; // true or false
        }

        return place;
      })
    );

    return placesWithCategories;
  },

  async readFavoritePlaces(userId) {
    const userPlaces = await UserPlaces.findAll({
      where: {
        userId: userId,
      },
      attributes: ["placeId"],
    });

    const placeIds = userPlaces.map((up) => up.placeId);

    const places = await Place.findAll({
      attributes: ["placeId", "name", "description", "rating", "country"],
      where: {
        placeId: placeIds,
      },
    });

    const placesWithPhotos = await Promise.all(
      places.map(async (place) => {
        const photos = await place.getPhotos({
          attributes: ["photoId", "filename", "order"],
        });

        place.dataValues.photos = photos;
        place.dataValues.isFavorite = true;
        return place;
      })
    );

    return placesWithPhotos;
  },

  async readPlace(placeId, userId) {
    const place = await Place.findByPk(placeId, {
      attributes: [
        "placeId",
        "lat",
        "lng",
        "name",
        "description",
        "rating",
        "country",
      ],
    });

    const categories = await place.getCategories();
    place.dataValues.categories = categories.map((category) => category.name);

    const photos = await place.getPhotos({
      attributes: ["photoId", "filename", "order"],
    });
    place.dataValues.photos = photos;

    if (userId) {
      const favorite = await UserPlaces.findOne({
        where: {
          userId: userId,
          placeId: placeId,
        },
      });
      place.dataValues.isFavorite = !!favorite; // true or false
    }

    return place;
  },

  async readPlaceDetails(placeId, userId) {
    const placeDetails = await Place.findByPk(placeId, {
      attributes: ["placeId", "description", "rating", "country"],
    });

    const photos = await placeDetails.getPhotos({
      attributes: ["photoId", "filename", "order"],
    });
    placeDetails.dataValues.photos = photos;

    if (userId) {
      const favorite = await UserPlaces.findOne({
        where: {
          userId: userId,
          placeId: placeId,
        },
      });
      placeDetails.dataValues.isFavorite = !!favorite; // true or false
    }

    return placeDetails;
  },

  async createPlace(place, t) {
    const content = Utils.removeAllSpace(place.name + place.description);
    const disassembledContent = disassembleHangul(content);
    const chosungs = Utils.extractChosungs(disassembleHangulToGroups(content));

    place.hanguls = Utils.convertToHangul(disassembledContent);
    place.chosungs = chosungs;
    place.alphabets = Utils.convertToAlphabet(disassembledContent);
    place.country = await GeoUtils.getCountryName(
      parseFloat(place.lat),
      parseFloat(place.lng)
    );

    return await Place.create(place, { transaction: t });
  },

  async updatePlace(placeId, password, changes) {
    const [updated] = await Place.update(changes, {
      where: { placeId: placeId },
    });

    return updated ? true : false;
  },

  async deletePlace(placeId, password) {
    const deleted = await User.destroy({
      where: {
        placeId: placeId,
      },
    });

    return deleted ? true : false;
  },
};
