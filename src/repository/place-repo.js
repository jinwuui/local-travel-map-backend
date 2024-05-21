const Place = require("../models/Place");

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

  async readPlaceDetails(placeId) {
    return await Place.findByPk(placeId, {
      attributes: ["description", "rating"],
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
