import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const { getMe } = useAuthStore();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/verify-otp", { userId, otp }, { withCredentials: true });
      await getMe();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurs!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FFF8F5] dark:bg-[#0f0f0f]">
      <div className="w-full max-w-md bg-white dark:bg-[#242424] rounded-3xl shadow-lg p-8 border border-coral/10 dark:border-white/5">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="font-display text-3xl font-bold text-coral mb-2">
            Verify Your OTP
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            6 Digit OTP is sent...
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="_ _ _ _ _ _ "
              maxLength={6}
              required
              className="w-full text-center text-2xl font-bold tracking-widest bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-4 outline-none focus:border-coral transition-colors dark:text-white placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-coral text-white font-bold py-3 rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP ✅"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOTP;