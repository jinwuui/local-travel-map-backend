const Announcement = require("../models/Announcement");
const Feedback = require("../models/Feedback");
const { format } = require("date-fns");

module.exports = {
  async getRecentAnnouncements() {
    const recentAnnouncements = await Announcement.findAll({
      attributes: ["version", "content", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit: 7,
    });

    const formattedAnnouncements = recentAnnouncements.map((announcement) => {
      const { createdAt, ...rest } = announcement.get();
      return {
        ...rest,
        date: format(new Date(createdAt), "yyyy-MM-dd"),
      };
    });

    return formattedAnnouncements;
  },

  async saveFeedback(feedback) {
    const newFeedback = await Feedback.create(feedback);
    return newFeedback;
  },
};
