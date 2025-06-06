import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true },  
    size: { type: Number, required: true },
    isFavorite: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lockPassword: { type: String, default: null },
    folders: { type: Schema.Types.ObjectId, ref: "Folder" }
},{ timestamps: true });

export const File = mongoose.model("File", fileSchema);