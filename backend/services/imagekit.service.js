import imagekit from '../config/imagekit.js';
import ApiError from '../utils/ApiError.js';

// Uploads a single in-memory file (from multer) to ImageKit
export const uploadImageToImageKit = async (file, folder = 'Rentify/cars') => {
  try {
    const result = await imagekit.upload({
      file: file.buffer.toString('base64'),
      fileName: `${Date.now()}-${file.originalname}`,
      folder,
      useUniqueFileName: true,
    });
    return { url: result.url, fileId: result.fileId };
  } catch (err) {
    throw new ApiError(500, `Image upload failed: ${err.message}`);
  }
};

export const uploadMultipleImages = async (files, folder = 'Rentify/cars') => {
  return Promise.all(files.map((file) => uploadImageToImageKit(file, folder)));
};

export const deleteImageFromImageKit = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    // Log but don't block the calling operation on a delete failure
    console.error(`ImageKit delete failed for fileId ${fileId}: ${err.message}`);
  }
};
