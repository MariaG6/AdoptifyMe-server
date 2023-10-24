const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config"); // Handle cloudinary routes

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// POST "/api/upload" => Route that receives images, sends it to Cloudinary via the fileUploader and returns the images URL
router.post("/upload", fileUploader.array("imageUrl"), (req, res, next) => {
  if (!req.files) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ fileUrl: req.files });
});

// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  res.json({ fileUrl: req.file.path });
});

module.exports = router;
