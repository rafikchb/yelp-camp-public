const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "yelpCamp", // specify which folder in the cloudinary account we want to store the file in.
        allowedFormats: ["jpeg", "png", "jpg"] // format that we want to allow to be stored in the cloudinary folder.
    }
});

module.exports = {
    cloudinary,
    storage
}