const express = require("express");
const router = express.Router();

const {localFileUpload} = require("../controllers/fileUploadController");

router.post("/upload", localFileUpload);

module.exports = router;
