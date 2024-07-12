const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", (err) => {
  console.error("DB - Redis:", err);
});

redisClient.on("connect", () => {
  console.log("DB - Redis:      Connected successfully!");
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

module.exports = { redisClient, connectRedis };
