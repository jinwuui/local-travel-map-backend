const express = require("express");
const path = require("path");
const cors = require("cors");
const router = require("./src/routes/router.js");
const sequelize = require("./src/config/database.js");
const {
  Place,
  Photo,
  Category,
  PlaceCategories,
  User,
  UserPlaces,
} = require("./src/models");

const app = express();

app.use(cors());

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

app.use(router);

const PORT = 3000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & tables created!");
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to create database or tables:", error);
  });
