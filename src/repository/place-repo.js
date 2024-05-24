const Place = require("../models/Place");
const Utils = require("../utils/utils");
const {
  disassembleHangul,
  disassembleHangulToGroups,
} = require("@toss/hangul");

module.exports = {
  async readPlacesWithCategories() {
    const places = await Place.findAll({
      attributes: ["placeId", "lat", "lng", "name"],
    });

    const placesWithCategories = await Promise.all(
      places.map(async (place) => {
        const categories = await place.getCategories();

        place.dataValues.categories = categories.map(
          (category) => category.name
        );

        return place;
      })
    );

    return placesWithCategories;
  },

  async readPlace(placeId) {
    const place = await Place.findByPk(placeId, {
      attributes: ["placeId", "lat", "lng", "name", "description", "rating"],
    });

    const categories = await place.getCategories();
    const photos = await place.getPhotos({
      attributes: ["photoId", "filename", "order"],
    });

    place.dataValues.categories = categories.map((category) => category.name);
    place.dataValues.photos = photos;

    return place;
  },

  async readPlaceDetails(placeId) {
    const placeDetails = await Place.findByPk(placeId, {
      attributes: ["placeId", "description", "rating"],
    });

    const photos = await placeDetails.getPhotos({
      attributes: ["photoId", "filename", "order"],
    });

    placeDetails.dataValues.photos = photos;
    return placeDetails;
  },

  async createPlace(place, t) {
    const content = Utils.removeAllSpace(place.name + place.description);
    const disassembledContent = disassembleHangul(content);
    const chosungs = Utils.extractChosungs(disassembleHangulToGroups(content));

    place.hanguls = Utils.convertToHangul(disassembledContent);
    place.chosungs = chosungs;
    place.alphabets = Utils.convertToAlphabet(disassembledContent);

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
