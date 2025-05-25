import mongoose from "mongoose";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const totalsize= asyncHandler(async(_req, res) => {
   
    const dbStats = await mongoose.connection.db.stats();
      
    const totalBytes = dbStats.dataSize + dbStats.indexSize;
    if (!totalBytes) {
      throw new ApiError(400, "Total bytes not founded")
    }
    const totalMB = totalBytes / (1024 * 1024);

    const dataSizeMB = (dbStats.dataSize / (1024 * 1024)).toFixed(2);
    const indexSizeMB = (dbStats.indexSize / (1024 * 1024)).toFixed(2);
    const storageSizeMB = (dbStats.storageSize / (1024 * 1024)).toFixed(2)
    const currentUsageMB = totalMB.toFixed(2)
      

    return res.status(200).json(
      new ApiResponse(200, "MongoDB Atlas free tier has 512 MB storage limit.", { dataSizeMB, indexSizeMB, storageSizeMB, currentUsageMB})
    );     
});

const fileUsageOrTotalItem = asyncHandler(async (req,res) => {
    const totalItem = await File.countDocuments({});

    const db = mongoose.connection.db;

    const stats = await db.command({ collStats: 'files' });
     const storageSizeInBytes = stats.size; 
    const totalUsageINBytes = stats.totalIndexSize;

    return res.status(200).json(
      new ApiResponse(200, { totalUsageINBytes ,storageSizeInBytes, totalItem })
    );
});
const folderUsageOrTotalItem = asyncHandler(async (req,res) => {
    const totalItem = await Folder.countDocuments({});

    const db = mongoose.connection.db;

    const stats = await db.command({ collStats: 'folders' });

    const storageSizeInBytes = stats.size; 
    const totalUsageINBytes = stats.totalIndexSize; 

    // const totalBytes = stats.size + stats.totalIndexSize;
    // const totalMB = totalBytes / (1024 * 1024);

    // const dataSizeMB = (stats.dataSize / (1024 * 1024)).toFixed(2);
    // const indexSizeMB = (stats.indexSize / (1024 * 1024)).toFixed(2);
    // const currentUsageMB = totalMB.toFixed(2)
    // const totalGB = totalBytes / (1024 * 1024 * 1024);
    

    return res.status(200).json(
      new ApiResponse(200, { totalUsageINBytes,storageSizeInBytes,totalItem })
    );
});
const notesUsageOrTotalItem = asyncHandler(async(req, res)=>{
  const totalItem = await Note.countDocuments({});

    const db = mongoose.connection.db;

    const stats = await db.command({ collStats: 'notes' });
     const storageSizeInBytes = stats.size; 
    const totalUsageINBytes = stats.totalIndexSize;

    return res.status(200).json(
      new ApiResponse(200, { totalUsageINBytes ,storageSizeInBytes, totalItem })
    );
})
const totalImages = asyncHandler(async (req, res )=>{
    const totalImageItemsResult = await File.aggregate([
        {
            $match: {
                type: { $regex: /^image\// } 
            }
        },
        {
            $count: "totalImageItems" 
        }
    ]);

    const totalImageItems = totalImageItemsResult.length > 0 ? totalImageItemsResult[0].totalImageItems : 0;

    return res.status(200).json(
      new ApiResponse(200, totalImageItems)
    )
})
const totalPdf = asyncHandler(async (req, res )=>{
     const totalPdfItemsResult = await File.aggregate([
        {
            $match: {
                type: "application/pdf" // Filter for PDF type
            }
        },
        {
            $count: "totalPdfItems" // Count the matched documents
        }
    ]);
    const totalPdfItems = totalPdfItemsResult.length > 0 ? totalPdfItemsResult[0].totalPdfItems : 0;

    return res.status(200).json(
      new ApiResponse(200, totalPdfItems)
    )
})

export { fileUsageOrTotalItem, folderUsageOrTotalItem, notesUsageOrTotalItem, totalImages, totalPdf, totalsize };

