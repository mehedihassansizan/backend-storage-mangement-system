import { Folder } from "../models/folder.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createFolder = asyncHandler(async (req, res) => {
    const {name , parentId} = req.body;

    const newFolder = await Folder.create({name, parentId});
    
    const createdFolder = await Folder.findById(newFolder._id)

    if (!createdFolder) {
        throw new ApiError(400, "folder not found")
    }

    return res.status(201).json(
        new ApiResponse(200, createFolder, "new folder create successfully")
    )

});

const getFolders = asyncHandler(async (req, res) => {
    const folders = await Folder.find()
    .populate( "files") 
    .populate("notes")
    
    if (!folders) {
        throw new ApiError(404, " folder not found")
    }

    return res.status(201).json(
        new ApiResponse(200, folders, "All folder get successfully")
    )
});

const updateFolderName = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if (!name) {
        throw new ApiError(400, "name is required")
    }

    const updatedFolder = await Folder.findByIdAndUpdate(req.params.id, {
        $set:{
            name
        }
    }, {new: true});

    return res.status(201).json(
        new ApiResponse(200, updatedFolder, "folder rename successfully")
    )
});

const deleteFolder = asyncHandler(async (req, res) => {
    await Folder.findByIdAndDelete(req.params.id);

    return res.status(201).json(
        new ApiResponse(200, "Floder delete successfully")
    )
});
const getSingleFolder = asyncHandler(async (req, res) => {
    const folder = await Folder.findById(req.params.id)
    .populate("files") 
    .populate("notes");

    if (!folder) {
        throw new ApiError(404, "folder not found")
    }

    return res.status(201).json(
        new ApiResponse(200, folder, "folder get successfully")
    )
});


export { createFolder, deleteFolder, getFolders, getSingleFolder, updateFolderName };

