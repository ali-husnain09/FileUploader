const File = require("../models/file");
const {cloudinary,cloudinaryConnect} = require("../config/cloudinary");

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

exports.imageUpload = async (req,res) => {
  try {
    const file = req.files.file;

    if (
      !file ||
      ![".png", ".jpg", ".jpeg", ".gif"].some(ext => file.name.toLowerCase().endsWith(ext))
    ) {
      return res.status(400).json({ message: "No valid image file uploaded" });
    }
    console.log("Image file received:", file);
    
    
    const uploadResponse = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "image",
      folder: "BackendSamples",
    });
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res.status(500).json({ message: "Error uploading image to Cloudinary" });
    }
    const newFile = new File({
      filename: file.name,
      path : uploadResponse.secure_url,
      email : "",
      tags : [],
    });
    await newFile.save();

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
  
}