const { Router } = require("express");
const placeRepo = require("../repository/place-repo");
const { HostNotFoundError } = require("sequelize");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const places = await placeRepo.readPlaces();
    res.status(200).json({ places: places });
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

router.post("/", async (req, res) => {
  try {
    const place = await placeRepo.createPlace(req.body);
    res.status(201).json({ placeId: place.id });
  } catch (error) {
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
