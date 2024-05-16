const Place = require("../models/Place");

module.exports = {
  async readPlaces() {
    return await Place.findAll({
      attributes: ["id", "lat", "lng", "name", "category"],
    });
  },

  async readPlaceDetails(placeId) {
    return await Place.findByPk(placeId, {
      attributes: ["description", "category"],
    });
  },

  async createPlace(place) {
    return await Place.create(place);
  },

  async updatePlace(placeId, password, changes) {
    const [updated] = await Place.update(changes, {
      where: { id: placeId },
    });

    return updated ? true : false;
  },

  async deletePlace(placeId, password) {
    const deleted = await User.destroy({
      where: {
        id: placeId,
      },
    });

    return deleted ? true : false;
  },
};
