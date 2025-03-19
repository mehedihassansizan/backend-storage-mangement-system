import { File } from "../models/file.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import cloudinary from "../utils/cloudinary.js";

const uploadFile = asyncHandler(async (req, res, next) => {
    if (!req.fileMetadata) return res.status(400).json(
        new ApiResponse(400, "No file uploaded")
    )

    res.status(200).json({
        message: 'File uploaded successfully!',
        file: req.fileMetadata,
      });
});

// Function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    const parts = url.split("/");
    const fileNameWithExtension = parts[parts.length - 1];
    const publicId = fileNameWithExtension.split(".")[0]; 
    return publicId;
};

const deletefile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) throw new ApiError(400, "File not found");

    const publicId = getPublicIdFromUrl(file.path);

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete file from MongoDB
    await File.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, "File deleted successfully")
    );

});

export { deletefile, uploadFile };

