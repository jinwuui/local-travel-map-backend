const express = require("express");
const cors = require("cors");
const router = require("./src/routes/router.js");
const sequelize = require("./src/config/database.js");
const { Place, Photo } = require("./src/models");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

const PORT = 3000;

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database & tables created!");
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to create database or tables:", error);
  });
