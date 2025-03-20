import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        default: "Untitled Note",
    },
    content: {
        type: String,
    },
    folders:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);