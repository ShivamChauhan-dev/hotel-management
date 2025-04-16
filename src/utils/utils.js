const cloudinary = require('cloudinary').v2;
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadImageToCloudinary = async (imagePath) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'hotel-management/rooms',
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Error uploading image to Cloudinary: ${error.message}`);
  }
};

const generateBookingId = () => {
  const id = uuidv4();
  return `BOOK-${id.substring(0, 8).toUpperCase()}`;
};

module.exports = {
  uploadImageToCloudinary,
  generateBookingId,
};