import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../utils/helper.js";
import { validationResult } from "express-validator";

export const getUser = async (req, res) => {
  res.json("okay");
};

export const userSignup = async (req, res) => {
  const { firstname, lastname, email, phoneNumber, otp } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: err.array()[0].msg });
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

// send otp
export const sendOtp = async (req, res) => {
  const { phoneNumber, type } = req.body;

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: err.array()[0].msg });
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
