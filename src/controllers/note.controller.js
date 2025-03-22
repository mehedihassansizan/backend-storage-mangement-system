import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNote = asyncHandler(async (req, res, next) => {
    const { title, content} = req.body;
    
    const newNote = await Note.create({
        title,
        content,
    });

    const createdNote = await Note.findById(newNote._id)

    if (!createdNote) {
        throw new ApiError(400,  "Note not found")  
    }

    return res.status(201).json(
        new ApiResponse(200, createdNote, "Note created successfully")
    )

});

const updateNote = asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;

    if (!title && !content) {
            throw new ApiError(400, "At least one of title or content is required")
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (content) updateFields.content = content;

    const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
    );

    if (!updatedNote) {
            throw new ApiError(404, null, "Note not found")
    }

    return res.status(200).json(
        new ApiResponse(200, updatedNote, "Note updated successfully")
    );
});

const getNotes = asyncHandler(async (req, res) => {
    const note = await Note.find().populate("folders",  { strictPopulate: false });

    if (!note) {
        throw new ApiError(404, null, "Notes not found")
    }

    return res.status(200).json(
        new ApiResponse(200, note, "All Notes")
    )

});

const getSingleNotes = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)
          .populate("folders",  { strictPopulate: false });
    
        if (!note) {
            throw new ApiError(404, null, "note not found")
        }
    
        return res.status(201).json(
            new ApiResponse(200, note, "note get successfully")
        )
});

const deleteNote = asyncHandler(async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);

    return res.status(201).json(
        new ApiResponse(200, null, "Note deleted successfully")
    )
});
const addNoteToFolder = asyncHandler(async (req, res) => {
    const {folderId} = req.params;

    const folder = await Folder.findById(folderId);
    if (!folder) throw new ApiError(404, "Folder not found");

    const { title, content} = req.body;
    
    const newNote = await Note.create({
        title,
        content,
    });

    const note = await Note.findById(newNote._id)
  
    
    if (!note) {
        throw new ApiError(404, "new note creation failed");
    }

    folder.notes.push(note._id);
    await folder.save();

    return res.status(200).json({
      message: "File added to folder successfully",
      folder,
    });
})


export { addNoteToFolder, createNote, deleteNote, getNotes, getSingleNotes, updateNote };

