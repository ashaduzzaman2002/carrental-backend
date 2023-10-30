import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../utils/helper.js";

export const getUser = async (req, res) => {
  res.json("okay");
};

export const userSignup = async (req, res) => {
  const { firstname, lastname, email, phoneNumber, otp } = req.body;

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// send otp
export const sendOtp = async (req, res) => {
  const { phoneNumber, type } = req.body;
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
