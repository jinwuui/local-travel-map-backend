const Place = require("../models/Place");

module.exports = {
  async readPlaces(category) {
    return await Place.findAll({
      attributes: ["placeId", "lat", "lng", "name", "category"],
    });
  },

  async readPlaceDetails(placeId) {
    return await Place.findByPk(placeId, {
      attributes: ["description", "category"],
    });
  },

  async createPlace(place, t) {
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
