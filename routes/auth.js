import express from "express";
import { getUser, sendOtp, userSignup } from "../controller/auth.js";
import {
  OTPInputValidation,
  userSignupInputValidation,
} from "../middleware/inputvalidation.js";

const router = express.Router();

router.get("/", getUser);
router.post("/signup", userSignupInputValidation, userSignup);
router.post("/otp", OTPInputValidation, sendOtp);

export default router;
