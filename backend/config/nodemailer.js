import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dk8400663713@gmail.com', 
        pass: 'mhjv zknx pvxl hvmw'    
    }
});

export default transporter;