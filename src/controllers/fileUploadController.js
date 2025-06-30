const File = require("../models/file");
const { cloudinary, cloudinaryConnect } = require("../config/cloudinary");

exports.localFileUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.files.file;
    console.log("File received:", file);
    // const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
    // resource_type: "auto",
    // });\
    let path = __dirname + "/uploads/" + file.name;
    // Save the file to the local filesystem
    file.mv(path, (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).json({ message: "Error uploading file" });
      }
    });

    const newFile = new File({
      filename: file.name,
      path: path,
      email: "",
      tags: [],
    });

    await newFile.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: file.name,
        path: path,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const UploadToCloudinary = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "BackendSamples",
    });
    return uploadResponse;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

const saveToDB = async (file, uploadResponse) => {
  try {
    const newFile = new File({
      filename: file.name,
      path: uploadResponse.secure_url,
      email: "",
      tags: [],
    });
    await newFile.save();
  } catch (error) {
    console.error("Error saving file to database:", error);
    throw new Error("Database save failed");
  }
};

exports.imageUpload = async (req, res) => {
  try {
    const file = req.files.file;
    const SupportedImageFormats = [".png", ".jpg", ".jpeg", ".gif"].some(
      (ext) => file.name.toLowerCase().endsWith(ext)
    );
    if (!file || !SupportedImageFormats) {
      return res.status(400).json({ message: "No valid image file uploaded" });
    }
    console.log("Image file received:", file);

    const uploadResponse = await UploadToCloudinary(file);
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res
        .status(500)
        .json({ message: "Error uploading image to Cloudinary" });
    }
    await saveToDB(file, uploadResponse);

    res.status(200).json({
      message: "Image uploaded successfully",
      file: {
        filename: file.name,
        path: uploadResponse.secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading image into cloudinary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.videoUpload = async (req, res) => {
  try {
    const video = req.files.video;
    const SupportedVideoFormats = ["mp4", "avi", "mov", "mkv"].some((ext) =>
      video.name.toLowerCase().endsWith(ext)
    );
    if (!video || !SupportedVideoFormats || video.size > 10 * 1024 * 1024) {
      // Limit to 10MB
      return res.status(400).json({
        success: false,
        message: "Unsupported video format or size too large",
      });
    }

    const uploadResponse = await UploadToCloudinary(video);
    console.log("Video file received:", video);
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res
        .status(500)
        .json({ message: "Error uploading video to Cloudinary" });
    }

    await saveToDB(video, uploadResponse);
    res.status(200).json({
      message: "Video uploaded successfully",
      file: {
        filename: video.name,
        path: uploadResponse.secure_url,
      },
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
