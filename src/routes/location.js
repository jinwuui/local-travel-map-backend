const { Router } = require("express");

const router = Router();

const locationController = require("../controllers/location");

router.get("/create", async (req, res) => {
  locationController.createLocation();
  res.send("create location");
});

module.exports = router;
