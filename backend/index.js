import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Correct CORS configuration
const allowedOrigins = [
  "http://localhost:5173",   // local dev
  "https://job-final-ten.vercel.app" // production
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email connection failed:', error);
  } else {
    console.log('✅ Email server ready to send messages');
  }
});

// Send job alert email
app.post('/api/v1/send-job-alert', async (req, res) => {
  try {
    const { to, subject, message, jobTitle, companyName } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Recipient email and message are required' });
    }

    const mailOptions = {
      from: {
        name: companyName || 'Job Portal Team',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: subject || `🏢 Job Opportunity: ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎯 New Job Opportunity!</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin-bottom: 10px;">${jobTitle || 'Exciting Position'}</h2>
            <h3 style="color: #667eea; margin-top: 0;">at ${companyName || 'Our Company'}</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #555; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #666;">This opportunity matches your skills and experience. We encourage you to apply!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/jobs" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📋 View All Jobs
              </a>
            </div>
          </div>
          <div style="background: #f1f3f4; padding: 20px; text-align: center; color: #666;">
            <p style="margin: 0;">Best regards,<br><strong>${companyName || 'Job Portal'} Team</strong></p>
            <p style="margin: 10px 0 0; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('📧 Email sent successfully to:', to);
    res.status(200).json({
      message: 'Email sent successfully',
      messageId: info.messageId,
      to: to
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

// Test email endpoint
app.post('/api/v1/send-test-email', async (req, res) => {
  try {
    const { to } = req.body;
    const testEmail = to || process.env.EMAIL_USER;

    const mailOptions = {
      from: { name: 'Job Portal System', address: process.env.EMAIL_USER },
      to: testEmail,
      subject: '🚀 Test Email: Job Portal System is Working!',
      html: `<div style="font-family: Arial, sans-serif;">
               <h1>✅ SUCCESS!</h1>
               <p>This confirms your email system works!</p>
             </div>`
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Test email sent to:', testEmail);
    res.status(200).json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      sentTo: testEmail
    });

  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at port ${PORT}`);
});
