import { Router } from "express";
import {
    changeCurrentPassword,
    forgetpassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resetPassword,
    updateAccountDetails,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgetpassword)
router.route("/reset-password").post(resetPassword)
// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)






export default router;