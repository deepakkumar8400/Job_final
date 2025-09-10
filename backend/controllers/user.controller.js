import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { TempUser } from '../models/TempUser.js'; // Add this import
import getDataUri from '../utils/dataUri.js';
import cloudinary from 'cloudinary';
import transporter from '../config/nodemailer.js';
import { generateOTP, setOTPExpiration } from '../utils/otpUtils.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };

        // Check if user already exists in verified users
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Check if temporary user exists and handle accordingly
        const existingTempUser = await TempUser.findOne({ email });
        
        if (existingTempUser) {
            // Check if OTP has expired
            if (existingTempUser.otpExpires < new Date()) {
                // Remove expired temporary user
                await TempUser.findByIdAndDelete(existingTempUser._id);
            } else {
                // Send new OTP to the same email
                const newOtp = generateOTP();
                const newOtpExpires = setOTPExpiration();
                
                existingTempUser.otp = newOtp;
                existingTempUser.otpExpires = newOtpExpires;
                await existingTempUser.save();

                // Send new OTP email
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'New Email Verification OTP',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Email Verification</h2>
                            <p>Hello ${fullname},</p>
                            <p>We noticed you didn't complete your registration. Here's a new OTP to verify your email address:</p>
                            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
                                <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${newOtp}</h1>
                            </div>
                            <p>This OTP will expire in 10 minutes.</p>
                            <br>
                            <p>Best regards,<br>Your App Team</p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);

                return res.status(200).json({
                    message: "A new OTP has been sent to your email. Please check your inbox.",
                    success: true,
                    tempUserId: existingTempUser._id
                });
            }
        }

        // Generate OTP and set expiration
        const otp = generateOTP();
        const otpExpires = setOTPExpiration();

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Upload profile photo if provided
        let profilePhotoUrl = "";
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        // Create temporary user (not a real account yet)
        const tempUser = await TempUser.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            otp,
            otpExpires,
            profilePhoto: profilePhotoUrl
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Hello ${fullname},</p>
                    <p>Thank you for registering. Please use the following OTP to verify your email address and complete your registration:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
                        <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            message: "Please check your email for verification OTP to complete registration.",
            success: true,
            tempUserId: tempUser._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false
            });
        }

        // Find the temporary user
        const tempUser = await TempUser.findOne({ email });
        
        if (!tempUser) {
            return res.status(404).json({
                message: "No pending registration found for this email",
                success: false
            });
        }

        if (tempUser.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false
            });
        }

        if (tempUser.otpExpires < new Date()) {
            // Remove expired temporary user
            await TempUser.findByIdAndDelete(tempUser._id);
            return res.status(400).json({
                message: "OTP has expired. Please register again.",
                success: false
            });
        }

        // Check if a verified user already exists with this email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await TempUser.findByIdAndDelete(tempUser._id);
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false
            });
        }

        // Create the actual user account
        const newUser = await User.create({
            fullname: tempUser.fullname,
            email: tempUser.email,
            phoneNumber: tempUser.phoneNumber,
            password: tempUser.password,
            role: tempUser.role,
            isVerified: true,
            profile: {
                profilePhoto: tempUser.profilePhoto,
            }
        });

        // Remove the temporary user
        await TempUser.findByIdAndDelete(tempUser._id);

        return res.status(200).json({
            message: "Email verified successfully. Your account has been created.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password and role are required",
                success: false
            });
        };
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({
                message: "Please verify your email before logging in.",
                success: false
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        let cloudResponse = null;
        
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        
        // updating data
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        const tempUser = await TempUser.findOne({ email });
        
        if (!tempUser) {
            return res.status(404).json({
                message: "No pending registration found for this email",
                success: false
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpires = setOTPExpiration();

        // Update temporary user with new OTP
        tempUser.otp = otp;
        tempUser.otpExpires = otpExpires;
        await tempUser.save();

        // Send new OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'New Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Hello ${tempUser.fullname},</p>
                    <p>Here is your new OTP to verify your email address:</p>
                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
                        <h1 style="margin: 0; color: #333; letter-spacing: 5px;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <br>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "New OTP sent successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const cancelRegistration = async (req, res) => {
    try {
        const { tempUserId } = req.params;
        
        const tempUser = await TempUser.findById(tempUserId);
        
        if (!tempUser) {
            return res.status(404).json({
                message: "No pending registration found",
                success: false
            });
        }

        await TempUser.findByIdAndDelete(tempUserId);

        return res.status(200).json({
            message: "Registration cancelled successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const checkRegistrationStatus = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        // Check if user already exists in verified users
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({
                message: "User already exists with this email.",
                exists: true,
                verified: true,
                success: true
            });
        }

        // Check if temporary user exists
        const existingTempUser = await TempUser.findOne({ email });
        if (existingTempUser) {
            // Check if OTP has expired
            if (existingTempUser.otpExpires < new Date()) {
                // Remove expired temporary user
                await TempUser.findByIdAndDelete(existingTempUser._id);
                return res.status(200).json({
                    message: "Previous registration expired. You can register again.",
                    exists: false,
                    verified: false,
                    success: true
                });
            } else {
                return res.status(200).json({
                    message: "Registration pending verification. Please check your email for OTP.",
                    exists: true,
                    verified: false,
                    tempUserId: existingTempUser._id,
                    success: true
                });
            }
        }

        return res.status(200).json({
            message: "Email is available for registration.",
            exists: false,
            verified: false,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};