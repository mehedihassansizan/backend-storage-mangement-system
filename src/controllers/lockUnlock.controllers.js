import bcrypt from "bcrypt";
import { File } from "../models/file.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const fileLock = asyncHandler(async(req, res) =>{
    const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'Password is required.' });

  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  file.isLocked = true;
  file.lockPassword = hashedPassword;
  await file.save();

  return res.status(200).json(
    new ApiResponse(200, "file Lock successfully")
  );
});
const folderLock = asyncHandler(async(req, res)=>{
    const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'Password is required.' });

  const folder = await Folder.findById(req.params.id);
  if (!folder) return res.status(404).json({ message: 'Folder not found.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  folder.isLocked = true;
  folder.lockPassword = hashedPassword;
  await folder.save();

  return res.status(200).json(
    new ApiResponse(200, "Folder Lock successfully")
  );
})

const notesLock = asyncHandler(async (req, res) => {
     const { password } = req.body;

  if (!password) return res.status(400).json({ message: 'Password is required.' });

  const notes = await Note.findById(req.params.id);
  if (!notes) return res.status(404).json({ message: 'Note not found.' });

  const hashedPassword = await bcrypt.hash(password, 10);
  notes.isLocked = true;
  notes.lockPassword = hashedPassword;
  await notes.save();

  return res.status(200).json(
    new ApiResponse(200, "Note Lock successfully")
  );
})

const fileUnlock = asyncHandler(async (req, res) => {
    const { password } = req.body;

  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).json({ message: 'File not found.' });

  if (!file.isLocked) return res.json({ message: 'File is already unlocked.' });

  const isPasswordCorrect = await bcrypt.compare(password, file.lockPassword);

  if (isPasswordCorrect){
    file.isLocked = false;
    file.lockPassword = null;
    await file.save();
  }
 
  res.status(200).json(
    new ApiResponse(200, "File unlock Successfully")
  );
})
const folderUnlock = asyncHandler(async (req, res) => {
    const { password } = req.body;

  const folder = await Folder.findById(req.params.id);
  if (!folder) return res.status(404).json({ message: 'folder not found.' });

  if (!folder.isLocked) return res.json({ message: 'folder is already unlocked.' });

  const isPasswordCorrect = await bcrypt.compare(password, folder.lockPassword);

  if (isPasswordCorrect){
    folder.isLocked = false;
    folder.lockPassword = null;
    await folder.save();
  }
 
  res.status(200).json(
    new ApiResponse(200, "folder unlock Successfully")
  );
})
const noteUnlock = asyncHandler(async (req, res) => {
    const { password } = req.body;

  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'note not found.' });

  if (!note.isLocked) return res.json({ message: 'note is already unlocked.' });

  const isPasswordCorrect = await bcrypt.compare(password, note.lockPassword);

  if (isPasswordCorrect){
    note.isLocked = false;
    note.lockPassword = null;
    await note.save();
  }
 
  res.status(200).json(
    new ApiResponse(200, "note unlock Successfully")
  );
})

const getAllLockfileOrFolder = asyncHandler(async(req, res)=>{

    const lockedFiles = await File.find({  isLocked: true });
    const lockedFolders = await Folder.find({ isLocked: true });
    const lockedNotes = await Note.find({  isLocked: true });

    return res.status(200).json(
        new ApiResponse(200,{lockedFiles, lockedFolders, lockedNotes,}, "Locked items find successfully")
    );
});




export { fileLock, fileUnlock, folderLock, folderUnlock, getAllLockfileOrFolder, notesLock, noteUnlock };

