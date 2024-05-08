const { Router } = require("express");

const router = Router();

const locationController = require("../controllers/location");

router.get("/", async (req, res) => {
  console.log("get");
  locationController.createLocation();
  res.send("create location");
});

router.post("/", async (req, res) => {
  console.log("post");
  locationController.createLocation();
  res.send("create location");
});

module.exports = router;
