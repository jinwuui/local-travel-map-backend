const { Router } = require("express");
const router = Router();

router.use("/api/locations", require("./location"));

module.exports = router;
