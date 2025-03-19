import { Router } from "express";
import { createFolder, deleteFolder, getFolders, getSingleFolder, updateFolderName } from "../controllers/folder.controllers.js";

const router = Router();

router.route("/create-folder").post(createFolder);
router.route("/update-folder/:id").put(updateFolderName);
router.route("/delete-folder/:id").delete(deleteFolder);
router.route("/all-folders").get(getFolders);
router.route("/single-folder/:id").get(getSingleFolder);

export default router;

