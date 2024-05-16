const { Router } = require("express");
const router = Router();

router.use("/api/places", require("./place-route"));

module.exports = router;
