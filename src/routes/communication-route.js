const { Router } = require("express");

const communicationRepo = require("../repository/communication-repo");

const router = Router();

router.get("/announcements", async (req, res) => {
  try {
    const announcements = await communicationRepo.getRecentAnnouncements();

    res.status(200).json({ announcements });
  } catch (error) {
    console.error("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/feedbacks", async (req, res) => {
  try {
    const feedback = req.body;
    await communicationRepo.saveFeedback(feedback);

    res.status(201).send("Feedback saved successfully");
  } catch (error) {
    console.error("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
