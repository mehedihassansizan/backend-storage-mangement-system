import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleFavorite = asyncHandler(async (req, res, _next) => {
    const {type, id} = req.params;

    let item;
    if (type === "folder") {

        item = await Folder.findById(id);

    } else if (type === "file") {

        item = await File.findById(id);

    } else if (type === "note") {

        item = await Note.findById(id);

    } else {
        throw new ApiError(400, "Invalid type. Must be 'folder', 'file', or 'note'.");
    }

    if (!item) {
        throw new ApiError(404, "Item not found.");
    }

    item.isFavorite = !item.isFavorite;

    await item.save();

    return res.status(200).json(new ApiResponse(200, `${type} favorite status updated`, item));

});

const getFavoritesByType= asyncHandler(async (req, res, _next) => {
    const { type } = req.params;
        
        let model;
        if (type === "folder") model = Folder;
        else if (type === "file") model = File;
        else if (type === "note") model = Note;
        else return res.status(400).json({ message: "Invalid type" });

        if (!model) {
            throw new ApiError(404, "No favorite items found");
        }

        const favorites = await model.find({ isFavorite: true });

        if (favorites.length === 0) {
            return res.status(401).json(new ApiResponse(401, null, "Favorite not founded"));
        }

        return res.status(200).json(new ApiResponse(200, favorites, "Favorite founded"));
});
const getFavorites = asyncHandler(async (_req, res, _next) => {
    const favoriteFolders = await Folder.find({ isFavorite: true });
    const favoriteFiles = await File.find({ isFavorite: true });
    const favoriteNotes = await Note.find({ isFavorite: true });

    if (favoriteFolders.length ===0 && favoriteFiles.length ===0 && favoriteNotes.length ===0) {
        throw new ApiError(404, "No favorite items found");
    }

    return res.status(200).json(new ApiResponse(200, "Favorite items retrieved", {
        favoriteFolders,
        favoriteFiles,
        favoriteNotes
    }));
});


export { getFavorites, getFavoritesByType, toggleFavorite };

