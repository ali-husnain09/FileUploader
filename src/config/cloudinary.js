const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        })
        console.log("Connected to Cloudinary successfully ✅😍");
    } catch (error) {
        console.error("❌ Error connecting to Cloudinary:", error);
        
    }
};


// Export the cloudinary instance for use in other files
module.exports = { cloudinary, cloudinaryConnect };