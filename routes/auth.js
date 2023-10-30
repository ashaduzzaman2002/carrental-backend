import express from "express";
import { getUser, sendOtp, userLogin, userLogout, userSignup } from "../controller/auth.js";
import {
  OTPInputValidation,
  userLoginInputValidation,
  userSignupInputValidation,
} from "../middleware/inputvalidation.js";
import { validedToken } from "../middleware/tokenValidation.js";

const router = express.Router();

router.get("/", validedToken, getUser);
router.post("/otp", OTPInputValidation, sendOtp)
router.post("/signup", userSignupInputValidation, userSignup);
router.post("/login", userLoginInputValidation, userLogin);
router.get("/logout", validedToken, userLogout);
;

export default router;
