const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

const originalsDir = path.resolve(__dirname, "../../public/images/originals/");
const thumbnailsDir = path.resolve(
  __dirname,
  "../../public/images/thumbnails/"
);

// Ensure originals + thumbnails directory exists
if (!fs.existsSync(originalsDir)) {
  fs.mkdirSync(originalsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, originalsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const generateThumbnail = (
  filePath,
  thumbnailPath,
  width = 300,
  height = 300
) => {
  return sharp(filePath).resize(width, height).toFile(thumbnailPath);
};

const uploadAndGenerateThumbnail = (req, res, next) => {
  upload.array("photos", 3)(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    try {
      await Promise.all(
        req.files.map((file) => {
          const originalPath = file.path;
          const thumbnailPath = path.join(
            thumbnailsDir,
            path.basename(originalPath)
          );
          return generateThumbnail(originalPath, thumbnailPath);
        })
      );
      next();
    } catch (thumbnailErr) {
      next(thumbnailErr);
    }
  });
};

module.exports = { uploadAndGenerateThumbnail };
