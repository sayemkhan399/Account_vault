import React, { useState, useContext, use } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { ThemeContext } from "../../context/themeContext/ThemeContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import axios from "axios";

export default function NewEntryModal({ onClose }) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { user } = use(AuthContext);

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://vault-server-blue.vercel.app/vaults", {
        title,
        username,
        password,
        notes,
        category,
        userId: user._id,
        userEmail: user.email,
      })
      .then((response) => {
        console.log("User data saved:", response.data);
        window.dispatchEvent(new Event("vaultsUpdated"));

        // Reset form
        setTitle("");
        setUsername("");
        setPassword("");
        setNotes("");
        setCategory("Login");
        onClose();
      })
      .catch((error) => {
        console.error("Error saving entry:", error);
        alert("Failed to save entry. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Theme classes
  const bg = isDark ? "bg-[#151515]" : "bg-white";
  const border = isDark ? "border-slate-700/50" : "border-slate-200/60";
  const text = isDark ? "text-slate-100" : "text-slate-900";
  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const input = isDark ? "bg-[#252525]/70" : "bg-slate-100/80";
  const icon = isDark
    ? "text-slate-400 hover:text-slate-200"
    : "text-slate-500 hover:text-slate-700";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-xl rounded-2xl ${bg} ${border} border shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 ${border} border-b`}
        >
          <h2 className={`text-lg font-semibold ${text}`}>New Vault Entry</h2>
          <button
            type="button"
            onClick={onClose}
            className={icon}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Account Name */}
          <div>
            <label
              className={`block text-xs uppercase tracking-wide font-medium mb-1.5 ${muted}`}
            >
              Account Name
            </label>
            <input
              required
              placeholder="Google, GitHub, Facebook..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full rounded-xl ${input} px-4 py-3 text-sm ${text} outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Username */}
          <div>
            <label
              className={`block text-xs uppercase tracking-wide font-medium mb-1.5 ${muted}`}
            >
              Username / Email
            </label>
            <input
              required
              placeholder="you@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full rounded-xl ${input} px-4 py-3 text-sm ${text} outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-xs uppercase tracking-wide font-medium mb-1.5 ${muted}`}
            >
              Password
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl ${input} px-4 py-3 pr-12 text-sm ${text} outline-none focus:ring-2 focus:ring-green-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className={icon} />
                ) : (
                  <Eye size={18} className={icon} />
                )}
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              className={`block text-xs uppercase tracking-wide font-medium mb-1.5 ${muted}`}
            >
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full rounded-xl ${input} px-4 py-3 text-sm ${text} outline-none focus:ring-2 focus:ring-green-500 appearance-none`}
            >
              <option value="Login">Login</option>
              <option value="Social">Social</option>
              <option value="Work">Work</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label
              className={`block text-xs uppercase tracking-wide font-medium mb-1.5 ${muted}`}
            >
              Notes (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Recovery info, 2FA hints, reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`w-full rounded-xl ${input} px-4 py-3 text-sm ${text} outline-none resize-none focus:ring-2 focus:ring-green-500`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-5 ${border} border-t`}>
          <button
            type="submit"
            className="w-full rounded-xl py-3 font-semibold text-white bg-green-600 hover:bg-green-500 transition-colors duration-200"
          >
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
}
