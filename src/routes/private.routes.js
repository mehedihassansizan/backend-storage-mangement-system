import { Router } from "express";
import { fileLock, fileUnlock, folderLock, folderUnlock, getAllLockfileOrFolder, notesLock, noteUnlock } from "../controllers/lockUnlock.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/lock-file/:id").post(verifyJWT, fileLock);
router.route("/lock-folder/:id").post(verifyJWT, folderLock);
router.route("/lock-note/:id").post(verifyJWT, notesLock);
router.route("/unlock-file/:id").post(verifyJWT, fileUnlock);
router.route("/unlock-folder/:id").post(verifyJWT, folderUnlock);
router.route("/unlock-note/:id").post(verifyJWT, noteUnlock);
router.route("/private-items").get(verifyJWT, getAllLockfileOrFolder);


export default router;