import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Shield,
  Key,
  Globe,
  Monitor,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { ThemeContext } from "../../context/themeContext/ThemeContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import axios from "axios";

export default function Sidebar({
  passwords = [],
  selectedCategory,
  onSelectCategory,
}) {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const isDark = theme === "dark";

  const currentUserPasswords = useMemo(
    () => (Array.isArray(passwords) ? passwords : []),
    [passwords],
  );

  useEffect(() => {
    if (!user?.email) return;
    const source = axios.CancelToken.source();

    axios
      .get(
        `https://vault-server-blue.vercel.app/users?email=${encodeURIComponent(user.email)}`,
        { cancelToken: source.token },
      )
      .then((res) =>
        setUserData(Array.isArray(res.data) ? res.data[0] : res.data),
      )
      .catch(() => {});

    return () => source.cancel();
  }, [user?.email]);

  const getCount = (label) => {
    if (label === "All") return currentUserPasswords.length;
    return currentUserPasswords.filter((p) => p.category === label).length;
  };

  // 🔹 UPDATED: Added "Finance" category
  const categories = [
    { label: "All", icon: Shield },
    { label: "Login", icon: Key },
    { label: "Social", icon: Globe },
    { label: "Work", icon: Monitor },
    { label: "Finance", icon: Wallet },
    { label: "Other", icon: Settings },
  ];

  // Mobile layout split
  const leftTabs = categories.slice(0, 3);
  const rightTabs = categories.slice(3);

  const bg = isDark ? "bg-[#1a1a1a]/65" : "bg-white/65";
  const border = isDark ? "border-slate-700/40" : "border-slate-200/60";
  const text = isDark ? "text-slate-300" : "text-slate-700";

  if (!user) return null;

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className={`hidden md:flex h-full w-72 flex-col rounded-2xl backdrop-blur-xl ${bg} ${border} border-r ${text}`}
      >
        <div className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
          {categories.map((category) => (
            <SidebarItem
              key={category.label}
              icon={<category.icon size={18} />}
              label={category.label}
              count={getCount(category.label)}
              active={selectedCategory === category.label}
              onClick={() => onSelectCategory(category.label)}
            />
          ))}
        </div>

        <div className={`p-4 border-t ${border}`}>
          <div className="flex items-center gap-3 rounded-xl p-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {userData?.name || "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {userData?.email || user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <nav
        className={`md:hidden fixed bottom-4 left-4 right-4 z-50 rounded-[28px]
        ${bg} ${border} backdrop-blur-2xl
        shadow-[0_25px_45px_rgba(0,0,0,0.28)]`}
      >
        <div className="relative h-20 flex items-center justify-between px-6">
          {/* LEFT TABS */}
          <div className="flex gap-6">
            {leftTabs.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.label;

              return (
                <button
                  key={category.label}
                  onClick={() => onSelectCategory(category.label)}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon
                    size={22}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-indigo-500 scale-110 -translate-y-1"
                        : text
                    }`}
                  />
                  <span
                    className={`text-[10px] transition ${
                      isActive ? "text-indigo-500" : "opacity-60"
                    }`}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT TABS */}
          <div className="flex gap-6">
            {rightTabs.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.label;

              return (
                <button
                  key={category.label}
                  onClick={() => onSelectCategory(category.label)}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon
                    size={22}
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-indigo-500 scale-110 -translate-y-1"
                        : text
                    }`}
                  />
                  <span
                    className={`text-[10px] transition ${
                      isActive ? "text-indigo-500" : "opacity-60"
                    }`}
                  >
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CENTER FLOATING AVATAR */}
          <div className="absolute left-1/2 -top-10 -translate-x-1/2">
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center
              ring-4 ring-white/40
              shadow-[0_14px_30px_rgba(99,102,241,0.65)]"
            >
              <User size={26} className="text-white" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
