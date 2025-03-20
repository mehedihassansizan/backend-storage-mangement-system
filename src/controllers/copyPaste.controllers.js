import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getModel = (type) => {
    if (type === "file") return File;
    if (type === "folder") return Folder;
    if (type === "note") return Note;
    return null;
};

const copyItem = asyncHandler(async (req, res, _next) => { 
    const { type, id } = await req.params;
    const Model = getModel(type);

    if (!Model) {
        throw new ApiError(400, "Invalid type");
    }

    const existingItem = await Model.findById(id);
    if (!existingItem) {
        throw new ApiError(404, "Item not found");
    }

    req.session.copiedItem = { type, id }; 

    return res.status(200).json(new ApiResponse(200, existingItem, `${type} copied successfully`));
});

const pasteItem = asyncHandler(async (req, res, _next) => {
    const { copiedItem } = req.session;


    if (!copiedItem) {
        throw new ApiError(400, "No item copied");
    }

    const { type, id } = copiedItem;
    const Model = getModel(type);

    if (!Model) {
        throw new ApiError(400, "Model not found");
    }

    const itemToPaste = await Model.findById(id);
    if (!itemToPaste) {
        throw new ApiError(404, "Item not found to paste");
    }


    const { destinationId } = req.params;

    let destinationFolder = null;
    if (destinationId) {

        destinationFolder = await Folder.findById(destinationId);
        if (!destinationFolder) {
            throw new ApiError(404, "Destination folder not found");
        }

    }

    // Initialize the copied item with new name and date
    const newItem = new Model({
        ...itemToPaste.toObject(),
        _id: undefined,
        name: itemToPaste.name + " - Copy",
        createdAt: new Date(), 
    });

    

    // If destination folder is provided, add the new item to the folder
    if (destinationFolder) {
        if (type === "file") {

            destinationFolder.files.push(newItem);

        } else if (type === "folder") {

            destinationFolder.folders.push(newItem);

        } else if (type === "note") {
            
            destinationFolder.notes.push(newItem);
        }

        // Save the updated destination folder with the new item
        await destinationFolder.save();
    } else {
        // If no destination folder is provided, we can store the file directly in the "files" collection
        if (type === "file") {

           await Model.create(newItem);

        } else if (type === "folder") {

            await Model.create(newItem);

        } else if (type === "note") {

            await Model.create(newItem);
        }
    }
    return res.status(201).json(new ApiResponse(201, `${type} pasted successfully`, newItem));

});

const duplicateItem = asyncHandler(async (req, res, _next) => {
    const { type, id } = req.params;
    const Model = getModel(type);

    if (!Model) {
        throw new ApiError(400, "Invalid type");
    }

    const itemToDuplicate = await Model.findById(id);
    if (!itemToDuplicate) {
        throw new ApiError(404, `${type} not found`);
    }

    const newItem = new Model({
        ...itemToDuplicate.toObject(),
        _id: undefined, 
        name: itemToDuplicate.name + " - Copy", 
        createdAt: new Date(), 
    });

    await newItem.save();

    return res.status(201).json(new ApiResponse(201, `${type} duplicated successfully`, newItem));
});

export { copyItem, duplicateItem, pasteItem };

