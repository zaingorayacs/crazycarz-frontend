import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = useSelector((state) => state.auth.userData.email);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      // Handle successful verification
      setMessage("OTP verified successfully! Redirecting...");
      const accessToken = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      const userData = res.data.data.user;
      console.log("accessToken:", res.data.data);
      console.log("User Object:", res.data.data.user);
      
      // Store tokens and user data
      localStorage.setItem('adminToken', accessToken);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('adminData', JSON.stringify(userData));
      
      dispatch(login({ accessToken, refreshToken, userData }));

      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Verify OTP
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            A one-time password has been sent to your email. Please enter it
            below to continue.
          </p>
        </div>

        {/* Message Box */}
        {message && (
          <div
            className={`p-3 text-sm rounded-lg ${
              message.toLowerCase().includes("failed")
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleOtpVerification}>
          {/* OTP Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <ShieldCheck size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-10 py-3 text-center border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
