const { Router } = require("express");

const sequelize = require("../config/database");
const { uploadAndGenerateThumbnail } = require("../config/upload");

const placeRepo = require("../repository/place-repo");
const photoRepo = require("../repository/photo-repo");
const categoryRepo = require("../repository/category-repo");

const router = Router();

// READ
router.get("/", async (req, res) => {
  try {
    const params = req.query;
    const whereClause = {};

    if (params.category) {
      whereClause["$Categories.name$"] = params.category;
    }

    const places = await placeRepo.readPlacesWithCategories(whereClause);

    if (places) res.status(200).json({ places: places });
    else res.status(204).json({ places: [] });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/:placeId", async (req, res) => {
  try {
    const place = await placeRepo.readPlace(req.params.placeId);

    res.status(200).json({ place: place });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/:placeId/details", async (req, res) => {
  try {
    const placeDetails = await placeRepo.readPlaceDetails(req.params.placeId);
    res.status(200).json({ placeDetails: placeDetails });
  } catch (error) {
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

// CREATE
router.post("/", uploadAndGenerateThumbnail, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    console.log("create", req.body);
    const place = await placeRepo.createPlace(req.body, t);
    const photos = await photoRepo.createPhotos(req.files, place.placeId, t);
    const categories = await categoryRepo.addCategoriesToPlace(
      place,
      req.body.categories,
      t
    );

    await t.commit();
    res.status(201).json({
      placeId: place.placeId,
      lat: place.lat,
      lng: place.lng,
      name: place.name,
      categories: categories?.map((category) => category.name),
      // TODO: place 생성 후엔 description, rating도 같이 보내서, 바로 details를 사이드뷰에 보여주기
    });
  } catch (error) {
    await t.rollback();
    console.log("-- error", error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
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

// DELETE
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
