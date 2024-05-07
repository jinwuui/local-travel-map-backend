const { Router } = require("express");
const router = Router();

router.use("/api/location", require("./location"));

module.exports = router;
