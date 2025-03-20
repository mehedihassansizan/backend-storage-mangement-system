import { Router } from "express";
import { getFavorites, getFavoritesByType, toggleFavorite } from "../controllers/favorite.controllers.js";

const router = Router();


router.route("/:type/:id/favorite").patch(toggleFavorite);
router.route("/all-favorites").get(getFavorites);
router.route("/:type").get(getFavoritesByType);

export default router;