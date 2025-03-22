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

//Need to provide proper type you want to copy or specific id
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

// if you want copy in a folder need to give type folder or destination id what you want! (must need to give type)
const pasteItem = asyncHandler(async (req, res, _next) => {
    const { copiedItem } = req.session;

    if (!copiedItem) {
        throw new ApiError(400, "No item copied");
    }

    const { type, id } = copiedItem;
    const {destinationId, types} = req.params;
    const Model = getModel(type);

    if (!Model) {
        throw new ApiError(400, "Model not found");
    }

    const itemToPaste = await Model.findById(id);
    if (!itemToPaste) {
        throw new ApiError(404, "Item not found to paste");
    }

    const newItem = new Model({
        ...itemToPaste.toObject(),
        _id: undefined, 
        name: itemToPaste.name + " - Copy", 
        createdAt: new Date(), 
    });


    let destinationFolder = null;
    if (destinationId) {

        destinationFolder = await Folder.findById(destinationId);

        if (!destinationFolder) {
            throw new ApiError(404, "Destination folder not found");
        }

    }

    // If destination folder is provided, add the new item to the folder
    if (destinationFolder) {
        if (type === "file") {
            if (types === "folder") {

                await destinationFolder.updateOne({
                    $push: { files: newItem._id }
                })
                await destinationFolder.save();
    
            }
        }else if(type === "note"){
            if (types === "folder") {

                await destinationFolder.updateOne({
                    $push: { notes: newItem._id }
                })
                await destinationFolder.save();
            }
        }else if (type === "folder") {
            if (types === "folder") {

                await destinationFolder.updateOne({
                    $push: { childFolder: newItem._id }
                })
                await destinationFolder.save();
    
            }
        }
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

    await newItem.save()

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

