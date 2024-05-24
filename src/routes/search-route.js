const { Router } = require("express");

const placeRepo = require("../repository/place-repo");
const photoRepo = require("../repository/photo-repo");
const categoryRepo = require("../repository/category-repo");
const searchRepo = require("../repository/search-repo");

const router = Router();

// READ
router.get("/autocomplete", async (req, res) => {
  try {
    console.log("autocomplte", req.query);
    const suggestions = await searchRepo.getAutocompleteSuggestions(
      req.query.query
    );

    res.status(200).json({ suggestions: suggestions });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
