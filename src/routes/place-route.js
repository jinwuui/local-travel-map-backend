const { Router } = require("express");
const sequelize = require("../config/database");
const upload = require("../config/upload");
const placeRepo = require("../repository/place-repo");
const photoRepo = require("../repository/photo-repo");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const places = await placeRepo.readPlaces(req.query.category);

    if (places) res.status(200).json({ places: places });
    else res.status(204).json({ places: [] });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/:placeId", async (req, res) => {
  try {
    const placeDetails = await placeRepo.readPlaceDetails(req.params.placeId);
    res.status(200).json({ placeDetails: placeDetails });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/", upload.array("photos", 3), async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log("create", req.body);
    const place = await placeRepo.createPlace(req.body, t);
    const photos = await photoRepo.createPhotos(req.files, place.placeId, t);

    console.log(place);
    await t.commit();
    res.status(201).json({
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
      name: place.name,
      category: place.category,
    });
  } catch (error) {
    await t.rollback();
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/:placeId", async (req, res) => {
  try {
    // TODO: BASE64 변환, 인터셉터에서 비밀번호 검사
    const password = req.headers["authorization"];

    const changes = req.body.changes;
    const result = await placeRepo.updatePlace(
      req.params.placeId,
      password,
      changes
    );

    if (result) res.status(200).json({ placeId: req.params.placeId });
    else throw Error({ message: "수정할 데이터가 존재하지 않습니다" });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:placeId", async (req, res) => {
  try {
    // TODO: BASE64 변환, 인터셉터에서 비밀번호 검사
    const password = req.headers["authorization"];
    const result = await placeRepo.deletePlace(req.params.placeId, password);

    if (result) res.status(204).json({ placeId: placeId });
    else throw Error({ message: "삭제할 데이터가 존재하지 않습니다" });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
