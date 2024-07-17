const Photo = require("../models/Photo");

module.exports = {
  async createPhotos(photos, placeId, t) {
    const photoData = photos.map((file, index) => ({
      placeId: placeId,
      filename: file.filename,

      order: index,
    }));

    return await Photo.bulkCreate(photoData, { transaction: t });
  },
};
