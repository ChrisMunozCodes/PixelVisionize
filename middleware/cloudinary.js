const cloudinary = require("cloudinary").v2

require("dotenv").config({ path: "./config/.env" })

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_COLUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = cloudinary;