import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getDataByDate = asyncHandler(async (req, res, _next) => {
    const { date } = req.query;

    if (!date) {
        throw new ApiError(400, "Invalid date");
    }

    // Get the start of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Get the end of the day
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const folders = await Folder.find({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });
    const files = await File.find({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });
    const notes = await Note.find({
        createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
        },
    });

    if (folders.length===0 && files.length===0 && notes.length===0) {
        return res.status(404).json(new ApiResponse(404, null, "No data found"));
        
    }

    return res.status(200).json(new ApiResponse(200, { folders, files, notes }, "Data fetched successfully"));

});

export { getDataByDate };

