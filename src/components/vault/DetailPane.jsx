import React, { useContext, useState, useEffect, useRef } from "react";
import { X, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../../context/themeContext/ThemeContext";

export default function DetailPane({ entry, onClose, onDelete }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const toastTimerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.visible) {
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 2200);
    }
    return () => clearTimeout(toastTimerRef.current);
  }, [toast.visible]);

  const showToast = (message, type = "success") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: true, message, type });
  };

  const copyToClipboard = (value, label) => {
    if (!value?.trim()) {
      showToast(`No ${label} to copy`, "error");
      return;
    }

    navigator.clipboard
      .writeText(value)
      .then(() => {
        showToast(`${label} copied!`, "success");
      })
      .catch((err) => {
        console.error(`Failed to copy ${label}:`, err);
        showToast(`Failed to copy ${label}`, "error");
      });
  };

  const handleDelete = () => {
    if (!entry?._id) return;

    fetch(`https://vault-server-blue.vercel.app/vaults/${entry._id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Delete failed");
        return response.json();
      })
      .then(() => {
        // CRITICAL: Dispatch update event BEFORE closing
        window.dispatchEvent(new Event("vaultsUpdated"));

        onDelete(entry._id);
        onClose();
        showToast("Entry deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting entry:", error);
        showToast("Failed to delete entry", "error");
      });
  };

  if (!entry) return null;

  // Theme classes (unchanged)
  const bg = isDark ? "bg-[#151515]/95" : "bg-white/90";
  const border = isDark ? "border-slate-700/50" : "border-slate-200/60";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const secondary = isDark ? "text-slate-400" : "text-slate-500";
  const muted = isDark ? "text-slate-500" : "text-slate-400";
  const field = isDark ? "bg-[#252525]/60" : "bg-slate-100/70";
  const icon = isDark
    ? "text-slate-400 hover:text-slate-200"
    : "text-slate-500 hover:text-slate-700";
  const danger = isDark
    ? "text-red-400 hover:text-red-300"
    : "text-red-600 hover:text-red-700";

  // Toast styles (unchanged)
  const toastBg =
    toast.type === "success"
      ? isDark
        ? "bg-emerald-500/90"
        : "bg-emerald-500"
      : isDark
        ? "bg-rose-500/90"
        : "bg-rose-500";
  const toastBorder =
    toast.type === "success" ? "border-emerald-400/30" : "border-rose-400/30";

  return (
    <>
      <aside
        className={`fixed right-0 top-20 bottom-0 w-full max-w-[420px] ${bg} backdrop-blur-xl ${border} border-l z-40 transition-colors duration-300`}
      >
        {/* Header */}
        <div
          className={`h-16 px-6 flex items-center justify-between ${border} border-b`}
        >
          <h3
            className={`text-xs uppercase tracking-wider font-medium ${muted}`}
          >
            Vault Entry
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className={danger}
              aria-label="Delete entry"
              title="Delete entry"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className={icon}
              aria-label="Close details"
              title="Close panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* Title & Category */}
          <div>
            <h2 className={`text-2xl font-bold ${text} truncate`}>
              {entry.title}
            </h2>
            <p className={`text-sm ${secondary} mt-1`}>{entry.category}</p>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label
              className={`text-xs uppercase tracking-wide font-medium ${muted}`}
            >
              Username / Email
            </label>
            <div
              className={`flex items-center justify-between ${field} rounded-xl px-4 py-3`}
            >
              <span className={`text-sm ${text} truncate`}>
                {entry.username}
              </span>
              <button
                onClick={() => copyToClipboard(entry.username, "Username")}
                className={`${icon} p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors`}
                aria-label="Copy username"
                title="Copy username"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              className={`text-xs uppercase tracking-wide font-medium ${muted}`}
            >
              Password
            </label>
            <div
              className={`flex items-center justify-between ${field} rounded-xl px-4 py-3`}
            >
              <span className="text-sm tracking-widest font-mono">
                {showPassword ? entry.password : "••••••••••"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${icon} p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors`}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => copyToClipboard(entry.password, "Password")}
                  className={`${icon} p-1 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-lg transition-colors`}
                  aria-label="Copy password"
                  title="Copy password"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="space-y-2">
              <label
                className={`text-xs uppercase tracking-wide font-medium ${muted}`}
              >
                Notes
              </label>
              <div
                className={`${field} rounded-xl p-4 text-sm ${text} leading-relaxed whitespace-pre-wrap`}
              >
                {entry.notes}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 md:right-8 max-w-[320px] p-3 rounded-xl shadow-lg z-50 transform transition-all duration-300 scale-100 opacity-100
            ${toastBg} ${toastBorder} border
            flex items-center gap-2`}
          role="alert"
          aria-live="assertive"
        >
          {toast.type === "success" ? (
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-ping absolute" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse absolute" />
          )}
          <div className="relative z-10 flex items-center gap-2">
            {toast.type === "success" ? (
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            ) : (
              <div className="w-1 h-1.5 bg-white transform rotate-45 origin-center" />
            )}
            <span className="text-white text-sm font-medium">
              {toast.message}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
