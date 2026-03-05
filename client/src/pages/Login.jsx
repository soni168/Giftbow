import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, user, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    return () => clearError();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FFF8F5] dark:bg-[#0f0f0f]">
      <div className="w-full max-w-md bg-white dark:bg-[#242424] rounded-3xl shadow-lg p-8 border border-coral/10 dark:border-white/5">

        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-coral">
            Giftbow 🌈
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Welcome back! Login k
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your@email.com"
              required
              className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral transition-colors dark:text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-coral/5 dark:bg-white/5 border border-coral/20 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-coral transition-colors dark:text-white placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-bold py-3 rounded-xl hover:bg-coral/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-white/10 rounded-xl py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="google" className="w-4 h-4" />
          Google
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have account{" "}
          <Link to="/signup" className="text-coral font-bold hover:underline">
            Sign up 
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;