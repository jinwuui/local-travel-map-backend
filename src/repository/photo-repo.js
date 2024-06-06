const Photo = require("../models/Photo");

module.exports = {
  async createPhotos(photos, placeId, t) {
    const photoData = photos.map((file, index) => ({
      placeId: placeId,
      filename: file.filename,

      order: index,
    }));

    console.log("createPhotos", photoData, placeId);
    return await Photo.bulkCreate(photoData, { transaction: t });
  },
};
