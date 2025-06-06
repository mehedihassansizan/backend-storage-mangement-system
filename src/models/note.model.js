import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        default: "Untitled Note",
    },
    content: {
        type: String,
    },
    type:{
        type: String,
        default: "note"
    },
    folders:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
    },
    isFavorite: { type: Boolean, default: false },
    type: { type: String, default: "note" },
    isLocked: { type: Boolean, default: false },
    lockPassword: { type: String, default: null }
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);