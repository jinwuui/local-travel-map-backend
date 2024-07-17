const Category = require("../models/Category");

module.exports = {
  async addCategoriesToPlace(place, categoryNames, t) {
    if (!Array.isArray(categoryNames) || categoryNames.length === 0) {
      return;
    }

    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        const [category] = await Category.findOrCreate({
          where: { name: name },
          defaults: { name: name },
          transaction: t,
        });
        return category;
      })
    );

    await place.addCategories(categories, { transaction: t });
    return categories;
  },
};
