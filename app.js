const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const router = require("./src/routes/router.js");
const sequelize = require("./src/config/database.js");
const pgClient = require("./src/config/postgresql.js");
const {
  Place,
  Photo,
  Category,
  PlaceCategories,
  User,
  UserPlaces,
  Announcement,
  Feedback,
} = require("./src/models");
const extractUserId = require("./src/middlewares/auth");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["date"],
};

app.use(cors(corsOptions));

// 정적 파일 서빙은 Nginx 에서 수행
app.use("/images", express.static(path.join(__dirname, "/public/images")));
app.use(
  "/images/thumbnails",
  express.static(path.join(__dirname, "/public/images/thumbnails"))
);
app.use(
  "/images/originals",
  express.static(path.join(__dirname, "/public/images/originals"))
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(extractUserId);
app.use(router);

const PORT = 3000;

const connectDatabases = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Sequelize: Database & tables created!");

    await pgClient.connect();
    console.log("PostgreSQL: Connected successfully!");

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectDatabases();
