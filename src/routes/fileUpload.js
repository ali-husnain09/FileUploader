const express = require("express");
const router = express.Router();

const {localFileUpload,imageUpload,videoUpload} = require("../controllers/fileUploadController");

router.post("/upload", localFileUpload);
router.post("/image-upload", imageUpload);
router.post("/video-upload", videoUpload);

module.exports = router;
