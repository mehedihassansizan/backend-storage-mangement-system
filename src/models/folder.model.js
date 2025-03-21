import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema({
    name:{
        type: String,
        default: "New Folder",
        trim: true,
        index: true
    },
    parentFolder:{
        type: Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },
    files:[
        {
            type:Schema.Types.ObjectId,
            ref: "File"
        }
    ],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ],
    isFavorite: { type: Boolean, default: false },
    type: { type: String, default: "folder" }
    
},{
    timestamps: true
})

export const Folder = mongoose.model("Folder", folderSchema);
