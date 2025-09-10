// routes/user.js (Updated with parse-resume route)
import express from "express";
import { login, logout, register, updateProfile, verifyOTP, resendOTP } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
import { cancelRegistration } from '../controllers/user.controller.js';
import { checkRegistrationStatus } from '../controllers/user.controller.js';
import parseResumeRouter from './parseResume.js'; // Import the parse resume router

const router = express.Router();

router.post('/check-registration', checkRegistrationStatus);
router.route("/register").post(singleUpload, register);
router.route("/verify-otp").post(verifyOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.delete('/cancel-registration/:userId', cancelRegistration);

// Add the parse resume route
router.use('/parse-resume', parseResumeRouter);

export default router;