import { useContext } from "react";
import { ThemeContext } from "../../context/themeContext/ThemeContext";

const SidebarItem = ({ icon, label, count, active, onClick }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-center md:justify-between
        px-3 md:px-4 py-3 rounded-xl transition-all duration-200
        ${
          active
            ? isDark
              ? "bg-indigo-500/10 text-slate-100" // subtle indigo tint in dark
              : "bg-indigo-500/10 text-slate-900" // same harmony in light
            : isDark
              ? "text-slate-400 hover:bg-slate-700/30"
              : "text-slate-600 hover:bg-slate-200/50"
        }
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50
      `}
      title={label}
    >
      <div className="flex items-center gap-3">
        <span
          className={
            active ? (isDark ? "text-indigo-300" : "text-indigo-500") : ""
          }
        >
          {icon}
        </span>
        <span className="hidden md:inline text-sm font-medium">{label}</span>
      </div>

      {/* Count Badge */}
      <span
        className={`
          hidden md:inline text-xs font-medium px-2 py-0.5 rounded-full
          ${
            active
              ? isDark
                ? "bg-indigo-500/20 text-indigo-200"
                : "bg-indigo-500/20 text-indigo-700"
              : isDark
                ? "bg-slate-700/50 text-slate-300"
                : "bg-slate-200 text-slate-600"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
};

export default SidebarItem;
