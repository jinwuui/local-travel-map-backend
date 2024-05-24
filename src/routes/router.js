const { Router } = require("express");
const router = Router();

router.use("/api/places", require("./place-route"));
router.use("/api/search", require("./search-route"));

module.exports = router;
