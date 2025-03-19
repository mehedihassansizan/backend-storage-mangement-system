import { Router } from "express";
import { createNote, deleteNote, getNotes, getSingleNotes, updateNote } from "../controllers/note.controller.js";

const router = Router();

router.route("/create-note").post(createNote)
router.route("/all-notes").get(getNotes)
router.route("/single-note/:id").get(getSingleNotes)
router.route("/update-note/:id").patch(updateNote)
router.route("/delete-note/:id").delete(deleteNote)

export default router;