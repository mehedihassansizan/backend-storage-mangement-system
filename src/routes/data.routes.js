import { Router } from "express";
import { getDataByDate } from "../controllers/data.controllers.js";

const router = Router();

router.route("/").get(getDataByDate);

export default router;