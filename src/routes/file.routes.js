import { Router } from "express";
import { deletefile, uploadFile } from "../controllers/file.controllers.js";
import { uploadFileToCloudinary } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload").post(uploadFileToCloudinary, uploadFile);
router.route("/delete/:id").delete(deletefile);

export default router;