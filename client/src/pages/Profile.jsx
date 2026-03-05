import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

function Profile() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-white mb-8">
        My Profile 👤
      </h1>

      {/* Avatar + Info */}
      <div className="bg-white dark:bg-[#242424] rounded-3xl p-6 border border-coral/10 dark:border-white/5 shadow-sm mb-4">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-coral object-cover"
          />
          <div>
            <h2 className="font-display text-xl font-bold text-gray-800 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-[#242424] rounded-3xl p-6 border border-coral/10 dark:border-white/5 shadow-sm mb-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Settings
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </span>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isDark ? "bg-coral" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                isDark ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;