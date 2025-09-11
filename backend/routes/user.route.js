// routes/user.js (Updated with parse-resume route)
import express from "express";
import { login, logout, register, updateProfile, verifyOTP, resendOTP } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;