const express = require("express");
const router = express.Router();

const {localFileUpload,imageUpload} = require("../controllers/fileUploadController");

router.post("/upload", localFileUpload);
router.post("/image-upload", imageUpload);
module.exports = router;
