import { useState } from 'react';
import axios from 'axios';

const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (emailData) => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ Make sure this endpoint matches your backend
      const response = await axios.post('http://localhost:8000/api/v1/send-job-alert', emailData);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Email sending error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || 'Failed to send email';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { sendEmail, loading, error };
};

export default useSendEmail;