import { Router } from "express";
import { addFileToFolder, deletefile, getFiles, getSingleFile, uploadFile } from "../controllers/file.controllers.js";
import { uploadFileToCloudinary } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/all-file").get(getFiles);
router.route("/single-file/:id").get(getSingleFile);
router.route("/upload").post(uploadFileToCloudinary, uploadFile);
router.route("/delete/:id").delete(deletefile);
router.route("/add-to-folder/:folderId").post(uploadFileToCloudinary, addFileToFolder);

export default router;