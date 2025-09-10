import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        enum: ['student', 'recruiter'],
        default: 'student'
    },
    otp: {
        type: String,
        required: true
    },
    otpExpires: {
        type: Date,
        required: true
    },
    profilePhoto: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

// Remove expired temporary users after 1 hour
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const TempUser = mongoose.model('TempUser', tempUserSchema);