import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
     role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    },
    profile: {
        profilePhoto: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            default: ""
        },
        skills: [{
            type: String,
            trim: true
        }],
        resume: {
            type: String,
            default: ""
        },
        resumeOriginalName: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);