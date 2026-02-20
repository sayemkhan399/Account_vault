import React, { useContext } from "react";
import { Moon, Sun, LogOut, Lock, ChevronDown } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/themeContext/ThemeContext";
import { AuthContext } from "../context/AuthContext/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logOutUser } = useContext(AuthContext); // FIXED: was "use(AuthContext)"
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  // Theme-specific styles
  const headerBg = isDark 
    ? "bg-[#0f0f0f]/95 backdrop-blur-2xl border border-[#252525]" 
    : "bg-white/90 backdrop-blur-xl border border-slate-200/70";
  const headerShadow = isDark 
    ? "shadow-[0_8px_32px_rgba(0,0,0,0.3)]" 
    : "shadow-[0_8px_32px_rgba(0,0,0,0.06)]";
  const logoGradient = isDark
    ? "bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
    : "bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent";
  const themeBtnBg = isDark
    ? "bg-[#1a1a1a] hover:bg-[#252525] border border-[#2d2d2d]"
    : "bg-slate-50 hover:bg-slate-100 border border-slate-200";
  const authBtnGradient = isDark
    ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
    : "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800";
  const navBtnGradient = isDark
    ? "bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600"
    : "bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg} ${headerShadow}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
        {/* LOGO - Modern gradient with icon */}
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => navigate("/")}>
          <div className={`
            p-1.5 rounded-xl transform transition-all duration-300
            ${isDark 
              ? 'bg-gradient-to-br from-indigo-600/20 to-purple-700/20 group-hover:from-indigo-600/30 group-hover:to-purple-700/30' 
              : 'bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:from-indigo-200 group-hover:to-purple-200'
            }
          `}>
            <Lock 
              size={20} 
              className={`
                transform transition-all duration-300
                ${isDark 
                  ? 'text-indigo-400 group-hover:text-indigo-300' 
                  : 'text-indigo-600 group-hover:text-indigo-700'
                }
              `} 
              strokeWidth={1.8}
            />
          </div>
          <h1 className={`text-2xl md:text-2.5xl font-black tracking-tight bg-clip-text ${logoGradient} transition-all duration-300 group-hover:scale-105`}>
            Vault<span className="opacity-70">.</span>
          </h1>
        </div>

        {/* ACTIONS - Modern button group */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle - Circular modern button */}
          <button
            onClick={toggleTheme}
            className={`
              p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
              ${themeBtnBg}
              hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5
              transform hover:scale-105 active:scale-95
              relative overflow-hidden
            `}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          >
            <div className={`
              absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-10 transition-opacity duration-300
              ${isDark ? 'from-amber-400/10 to-amber-500/5' : 'from-indigo-400/10 to-purple-500/5'}
            `} />
            {isDark ? (
              <Sun size={19} className="text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" strokeWidth={1.7} />
            ) : (
              <Moon size={19} className="text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" strokeWidth={1.7} />
            )}
          </button>

          {/* Auth Button - Gradient modern design */}
          {user ? (
            <div className="relative group">
              <button
                onClick={handleLogout}
                className={`
                  group/button flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
                  transition-all duration-300 shadow-md
                  ${authBtnGradient}
                  text-white hover:shadow-lg hover:shadow-red-500/25
                  transform hover:scale-[1.02] active:scale-95
                  relative overflow-hidden
                `}
                aria-label="Logout"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-500/20 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                <LogOut size={17} className="relative" strokeWidth={1.8} />
                <span className="relative hidden md:inline">Logout</span>
                <ChevronDown size={16} className="relative md:hidden" strokeWidth={2} />
              </button>
              
              {/* User email tooltip (mobile) */}
              <div className="absolute -bottom-8 left-1 -translate-x-1/2 px-3 py-1.5 bg-slate-800 text-xs text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {user.email}
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={`
                flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium
                transition-all duration-300 shadow-md
                ${navBtnGradient}
                text-white hover:shadow-lg hover:shadow-indigo-500/25
                transform hover:scale-[1.02] active:scale-95
                relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Login</span>
              <ChevronDown size={16} className="relative md:hidden" strokeWidth={2} />
            </NavLink>
          )}
        </div>
      </div>
      
      {/* Subtle bottom accent bar */}
      <div className={`
        absolute bottom-0 left-0 w-full h-0.5
        ${isDark 
          ? 'bg-gradient-to-r from-indigo-600/30 via-purple-600/40 to-indigo-600/30' 
          : 'bg-gradient-to-r from-indigo-500/20 via-purple-600/30 to-indigo-500/20'
        }
      `} />
    </header>
  );
};

export default Header;