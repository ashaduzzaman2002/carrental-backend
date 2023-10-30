import { body } from "express-validator";

export const OTPInputValidation = [
  body("phoneNumber").not().isEmpty().withMessage("Phone Number is required"),
  body("type").not().isEmpty().withMessage("Type is required"),
];

export const userSignupInputValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("phoneNumber").not().isEmpty().withMessage("Phone Number is required"),
  body("firstname").not().isEmpty().withMessage("Firstname is required"),
  body("lastname").not().isEmpty().withMessage("Lastname is required"),
  body("otp")
    .not()
    .isEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP must be 4 digits"),
];

export const userLoginInputValidation = [
  body("phoneNumber").not().isEmpty().withMessage("Phone Number is required"),
  body("otp")
    .not()
    .isEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP must be 4 digits"),
];
