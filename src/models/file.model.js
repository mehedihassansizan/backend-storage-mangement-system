import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
    name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true },
  folders: { type: Schema.Types.ObjectId, ref: "Folder" }
},{ timestamps: true });

export const File = mongoose.model("File", fileSchema);