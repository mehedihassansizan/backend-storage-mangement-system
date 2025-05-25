import { Router } from "express";
import { fileUsageOrTotalItem, folderUsageOrTotalItem, notesUsageOrTotalItem, totalImages, totalPdf, totalsize } from "../controllers/totalsize.controllers.js";

const router = Router();

router.route("/db-storage").get(totalsize);
router.route("/file-storage").get(fileUsageOrTotalItem);
router.route("/folder-storage").get(folderUsageOrTotalItem);
router.route("/total-images").get(totalImages);
router.route("/total-pdfs").get(totalPdf);
router.route("/notes-storage").get(notesUsageOrTotalItem);


export default router;