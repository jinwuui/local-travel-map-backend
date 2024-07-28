const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const originalsDir = path.resolve(__dirname, "../../public/images/originals/");
const thumbnailDir = path.resolve(__dirname, "../../public/images/resize/t/");
const smallDir = path.resolve(__dirname, "../../public/images/resize/s/");
const mediumDir = path.resolve(__dirname, "../../public/images/resize/m/");
const largeDir = path.resolve(__dirname, "../../public/images/resize/l/");

const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

[originalsDir, thumbnailDir, smallDir, mediumDir, largeDir].forEach(
  ensureDirectoryExistence
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, originalsDir);
  },
  filename: function (req, file, cb) {
    const filename = "photo-" + uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const resizeImage = (
  filePath,
  resizePath,
  resizeLimit,
  fit = sharp.fit.inside
) => {
  const resizeOptions = {
    width: resizeLimit,
    height: resizeLimit,
    fit: fit,
    withoutEnlargement: true,
  };

  return sharp(filePath)
    .resize(resizeOptions)
    .toFormat("webp")
    .toFile(resizePath);
};

const uploadAndGenerateResize = (req, res, next) => {
  upload.array("photos", 3)(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      await Promise.all(
        req.files.map((file) => {
          const originalPath = file.path;
          const thumbnailPath = getResizedImagePath(originalPath, thumbnailDir);
          const smallPath = getResizedImagePath(originalPath, smallDir);
          const mediumPath = getResizedImagePath(originalPath, mediumDir);
          const largePath = getResizedImagePath(originalPath, largeDir);

          resizeImage(originalPath, thumbnailPath, 320, sharp.fit.cover);
          resizeImage(originalPath, smallPath, 640);
          resizeImage(originalPath, mediumPath, 1280);
          resizeImage(originalPath, largePath, 1920);
        })
      );
      next();
    } catch (resizeError) {
      next(resizeError);
    }
  });
};

function getResizedImagePath(originalImagePath, targetDirectory) {
  const extension = path.extname(originalImagePath);
  const baseName = path.basename(originalImagePath, extension);

  const closestFolderName = path.basename(targetDirectory);

  const newFileName = `${baseName}-${closestFolderName}.webp`;

  return path.join(targetDirectory, newFileName);
}

module.exports = { uploadAndGenerateResize };
