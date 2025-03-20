import { Router } from "express";
import { copyItem, duplicateItem, pasteItem } from "../controllers/copyPaste.controllers.js";

const router = Router();

router.route("/:type/:id/copy").post(copyItem);
router.route("/:type/paste").post(pasteItem);
router.route("/:types/paste/:destinationId").post(pasteItem);
router.route("/:type/duplicate/:id").post(duplicateItem);

export default router;