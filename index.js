// Creation and configuration of the Express APP
const express = require("express");
const cors = require("cors");
const fileupload = require("express-fileupload");
const app = express();

// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload());
// Load environment variables and connect to the database
require("dotenv").config();

// Connect to the database
require("./src/config/database").connect();

// Load Cloudinary configuration
require("./src/config/cloudinary").cloudinaryConnect();
const upload = require("./src/routes/fileUpload");

// Route configuration
app.use("/api", upload);

// 404 handler
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
