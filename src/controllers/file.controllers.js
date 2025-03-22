import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
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

const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find();

    if (!files || files.length === 0) {
        throw new ApiError(404, "No files found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Files retrieved successfully", files)
    );
});

const getSingleFile = asyncHandler(async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) throw new ApiError(404, "File not found");

    return res.status(200).json(
        new ApiResponse(200, "File retrieved successfully", file)
    );
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

    await cloudinary.uploader.destroy(publicId);

    await File.findByIdAndDelete(req.params.id);

    return res.status(200).json(
        new ApiResponse(200, "File deleted successfully")
    );

});

const addFileToFolder = asyncHandler(async (req, res) => {
    const {folderId} = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) throw new ApiError(404, "Folder not found");


    if (!req.fileMetadata) return res.status(400).json(
        new ApiResponse(400, "No file uploaded")
    )

  
    const newFile = {file: req.fileMetadata}
    if (!newFile) {
        throw new ApiError(404, "new file creation failed");
    }

    folder.files.push(newFile.file._id);
    await folder.save();

    return res.status(200).json({
      message: "File added to folder successfully",
      folder,
    });
})

export { addFileToFolder, deletefile, getFiles, getSingleFile, uploadFile };

