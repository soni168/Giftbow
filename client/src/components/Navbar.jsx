import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 font-sans text-sm font-600">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">Home</Link>
          <Link to="/explore" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">Explore</Link>
          {user && (
            <>
              <Link to="/wishlist" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">Wishlist</Link>
              <Link to="/chat" className="text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">AI Chat</Link>
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
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#F26076]"
                />
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#F26076] transition-colors">Login</Link>
              <Link to="/signup" className="text-sm px-4 py-2 bg-[#F26076] text-white rounded-full hover:bg-[#e04f65] transition-colors">Sign Up</Link>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`block w-5 h-0.5 bg-[#F26076] transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#F26076] transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-[#F26076] transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FFF8F5] dark:bg-[#0f0f0f] border-t border-[#F26076]/20 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Home</Link>
          <Link to="/explore" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Explore</Link>
          {user && (
            <>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Wishlist</Link>
              <Link to="/chat" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">AI Chat</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Profile</Link>
              <button onClick={handleLogout} className="text-left text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Logout</button>
            </>
          )}
          {!user && (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-[#F26076]">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-[#F26076] text-white rounded-full hover:bg-[#e04f65]">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;