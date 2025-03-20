import { Router } from "express";
import { getDataByData } from "../controllers/data.controllers.js";

const router = Router();

router.route("/").get(getDataByData);

export default router;