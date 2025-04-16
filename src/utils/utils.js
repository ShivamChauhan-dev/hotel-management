import {v2 as cloudinary} from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/config.js';


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

const deleteImage = async (imageUrl) => {
  try {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`hotel-management/rooms/${publicId}`);
  } catch (error) {
      throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
  }
};

export {
  uploadImageToCloudinary,
  generateBookingId,
  deleteImage
};