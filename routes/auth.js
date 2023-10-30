import express from "express";
import { getUser, sendOtp, userSignup } from "../controller/auth.js";

const router = express.Router();

router.get("/", getUser);
router.post("/signup", userSignup);
router.post("/otp", sendOtp);

export default router;
