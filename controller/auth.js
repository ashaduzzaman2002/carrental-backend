import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../utils/helper.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

// get user
export const getUser = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(401)
        .json({ error: true, message: "Unauthorized access" });

    res.json({ error: false, message: "User data fetched", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

// send otp
export const sendOtp = async (req, res) => {
  const { phoneNumber, type } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: true, message: err.array()[0].msg });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (type === "signup" && user)
      return res
        .status(401)
        .json({ error: true, message: "User already exist" });

    if (type === "signin" && !user)
      return res
        .status(401)
        .json({ error: true, message: "User does not exist" });

    const otp = generateOTP();
    const hashOTP = bcrypt.hashSync(otp, 10);

    const isOTPExist = await OTP.findOne({ phoneNumber });
    let newOtp;
    if (isOTPExist) {
      newOtp = await OTP.findOneAndUpdate({ phoneNumber }, { value: hashOTP });
    } else {
      newOtp = new OTP({
        phoneNumber,
        value: hashOTP,
      });
      await newOtp.save();
    }

    res.json({
      error: false,
      otp: otp,
      message: "OTP send successfully",
      data: newOtp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Signup
export const userSignup = async (req, res) => {
  const { firstname, lastname, email, phoneNumber, otp } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ error: true, message: err.array()[0].msg });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const isOTPExist = await OTP.findOne({ phoneNumber });
    if (!isOTPExist)
      return res
        .status(400)
        .json({ error: true, message: "OTP does not exists" });

    const isOTPMatched = bcrypt.compareSync(otp, isOTPExist.value);
    if (!isOTPMatched)
      return res.status(400).json({ error: true, message: "Invalid OTP" });

    const newUser = new User({ firstname, lastname, phoneNumber, email });
    await newUser.save();

    res.clearCookie("token");

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRECT, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      error: false,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res
      .status(400)
      .json({ error: true, message: err.array().at(0).msg });
  }

  try {
    let user = await Restaurant.findOne({ email });

    if (!user)
      return res.status(404).json({ error: true, message: "User not exist" });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return res
        .status(401)
        .json({ error: true, message: "Invalid credentials" });

    res.clearCookie("token");

    const token = jwt.sign(
      { id: user._id, role: "RESTAURENT" },
      process.env.JWT_SECRECT,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      httpOnly: true,
      sameSite: "lax",
    });

    user.password = undefined;

    res
      .status(200)
      .json({ error: false, message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: true, message: "Internal server error" });
  }
};

// Logout
export const userLogout = async (req, res) => {
  try {
    res.cookie("token", null, {
      path: "/",
      expires: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      error: false,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
