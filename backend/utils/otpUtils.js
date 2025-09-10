// utils/otpUtils.js
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const setOTPExpiration = () => {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);
    return expiration;
};