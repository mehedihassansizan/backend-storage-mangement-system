import { Note } from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNote = asyncHandler(async (req, res, next) => {
    const { title, content , folderId} = req.body;
    
    const newNote = await Note.create({
        title,
        content,
        folderId
    });

    const createdNote = await Note.findById(newNote._id)

    if (!createdNote) {
        return res.status(401).json(
            new ApiResponse(400,  "Note not found")
        )
    }

    return res.status(201).json(
        new ApiResponse(200, createdNote, "Note created successfully")
    )

});

const updateNote = asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;

    if (!title && !content) {
        return res.status(400).json(
            new ApiResponse(400, null, "At least one of title or content is required")
        );
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
        return res.status(404).json(
            new ApiResponse(404, null, "Note not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, updatedNote, "Note updated successfully")
    );
});

const getNotes = asyncHandler(async (req, res) => {
    const note = await Note.find().populate("folders",  { strictPopulate: false });

    if (!note) {
        return res.status(404).json(
            new ApiResponse(404, null, "Notes not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, note, "All Notes")
    )

});

const getSingleNotes = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id)
          .populate("folders",  { strictPopulate: false });
    
        if (!note) {
            return res.status(404).json(
                new ApiResponse(404, null, "note not found")
            )
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


export { createNote, deleteNote, getNotes, getSingleNotes, updateNote };

