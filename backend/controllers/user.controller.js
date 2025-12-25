import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "cloudinary";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    // already exists check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false
      });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // profile photo upload (optional)
    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = upload.secure_url;
    }

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: true, // direct verified
      profile: {
        profilePhoto: profilePhotoUrl
      }
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Role mismatch",
        success: false
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true
      })
      .json({
        message: `Welcome ${user.fullname}`,
        success: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  return res
    .status(200)
    .cookie("token", "", { maxAge: 0 })
    .json({
      message: "Logged out successfully",
      success: true
    });
};

export const updateProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile update API working",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};
