const User = require("../models/User");
const Place = require("../models/Place");
const UserPlaces = require("../models/UserPlaces");
const bcrypt = require("bcrypt");

module.exports = {
  async findOrCreateUser(username, password) {
    try {
      const user = await User.findOne({ where: { username: username } });

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }
        return { user, isNewUser: false };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          password: hashedPassword,
        });
        return { user: newUser, isNewUser: true };
      }
    } catch (error) {
      console.error("Error finding or creating user:", error);
      throw error;
    }
  },

  async toggleFavoritePlace(userId, placeId) {
    const user = await User.findByPk(userId);
    const place = await Place.findByPk(placeId);

    if (!user) {
      throw new Error("Invalid userId");
    }
    if (!place) {
      throw new Error("Invalid placeId");
    }

    const favorite = await UserPlaces.findOne({
      where: { userId, placeId },
    });

    if (favorite) {
      await favorite.destroy();
      return false;
    } else {
      await UserPlaces.create({ userId, placeId });
      return true;
    }
  },
};
