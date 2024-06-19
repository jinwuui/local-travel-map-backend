const { Router } = require("express");

const sequelize = require("../config/database");

const userRepo = require("../repository/user-repo");

const router = Router();

// READ
router.get("/:userId", async (req, res) => {
  try {
    const user = await userRepo.readUser(req.params.userId);

    res.status(200).json({ user: user });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    console.log("login", req.body);
    const { username, password } = req.body;
    const result = await userRepo.findOrCreateUser(username, password);

    res.status(result.isNewUser ? 201 : 200).json(result);
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

// TOGGLE FAVORITE PLACE
router.post("/:userId/favorites", async (req, res) => {
  try {
    const userId = req.params.userId;
    const placeId = req.body.placeId;

    const result = await userRepo.toggleFavoritePlace(userId, placeId);

    res.status(200).json({ isFavorite: result });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
