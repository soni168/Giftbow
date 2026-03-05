import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFF8F5] dark:bg-[#0f0f0f] border-b border-[#F26076]/20 dark:border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-[#F26076]">
            🎁 Giftbow
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6 font-sans text-sm font-600">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">
            Explore
          </Link>
          {user && (
            <>
              <Link to="/wishlist" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">
                Wishlist
              </Link>
              <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">
                AI Chat
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-coral/10 hover:bg-coral/20 transition-colors text-lg"
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#F26076]"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-600 text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-600 text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-600 px-4 py-2 bg-[#F26076] text-white rounded-full hover:bg-[#e04f65] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;