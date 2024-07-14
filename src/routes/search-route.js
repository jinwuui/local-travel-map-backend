const { Router } = require("express");
const { performance } = require("perf_hooks");

const placeRepo = require("../repository/place-repo");
const photoRepo = require("../repository/photo-repo");
const categoryRepo = require("../repository/category-repo");
const searchRepo = require("../repository/search-repo");

const router = Router();

// READ
router.get("/autocomplete", async (req, res) => {
  const start = performance.now();

  try {
    const suggestions = await searchRepo.getAutocompleteSuggestions(
      req.query.query
    );

    res.status(200).json({ suggestions: suggestions });
  } catch (error) {
    console.error("-- error", error);
    res.status(400).json({ message: error.message });
  } finally {
    const end = performance.now();
    const duration = end - start;
    const formattedTime = `${duration.toFixed(2)} ms`.padStart(10);

    console.log(` - Time: ${formattedTime}  ("${req.query.query}")`);
  }
});

module.exports = router;
