const { Router } = require("express");

const sequelize = require("../config/database");

const userRepo = require("../repository/user-repo");

const router = Router();

// LOGIN OR SIGNUP
router.post("/", async (req, res) => {
  try {
    console.log("login", req.body);
    const { username, password } = req.body;
    const result = await userRepo.findOrCreateUser(username, password);

    res.status(result.isNewUser ? 201 : 200).json(result);
  } catch (error) {
    console.error("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

// TOGGLE FAVORITE PLACE
router.post("/favorites/:placeId", async (req, res) => {
  try {
    const userId = req.userId;
    const placeId = req.params.placeId;

    const result = await userRepo.toggleFavoritePlace(userId, placeId);

    res.status(200).json({ isFavorite: result });
  } catch (error) {
    console.error("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
