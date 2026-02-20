import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Plus, Search, X, SlidersHorizontal } from "lucide-react";
import { ThemeContext } from "../../context/themeContext/ThemeContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import axios from "axios";

export default function VaultList({
  searchTerm,
  selectedCategory,
  onSearch,
  onAdd,
  onSelect,
  selectedEntry,
}) {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const { user } = useContext(AuthContext);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

  // Centralized fetch function (UNCHANGED)
  const fetchVaults = useCallback(async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://vault-server-blue.vercel.app/vaults?userEmail=${encodeURIComponent(user.email)}`,
      );
      console.log("Vaults loaded:", response.data);
      setVaults(response.data);
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Failed to load vaults:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Initial load + user change (UNCHANGED)
  useEffect(() => {
    fetchVaults();
  }, [user?.email, fetchVaults]);

  // Listen for vault updates (UNCHANGED)
  useEffect(() => {
    const handleVaultUpdate = () => {
      console.log("Vault update detected - refetching...");
      fetchVaults();
    };

    window.addEventListener("vaultsUpdated", handleVaultUpdate);
    return () => window.removeEventListener("vaultsUpdated", handleVaultUpdate);
  }, [fetchVaults]);

  /* ------------------------------------------------------------------
     ✅ ACTIVE FILTERING: CATEGORY + SEARCH (ACCOUNT-AWARE)
     ------------------------------------------------------------------ */
  const filteredVaults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return vaults.filter((v) => {
      // Category match
      const categoryMatch =
        selectedCategory === "All" || v.category === selectedCategory;

      // Search match (title / username / email)
      const searchMatch =
        !q ||
        v.title?.toLowerCase().includes(q) ||
        v.username?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [vaults, selectedCategory, searchTerm]);

  // Theme classes (UNCHANGED)
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const listItemBg = isDark ? "bg-[#252525]/50" : "bg-white/60";
  const listItemHover = isDark ? "hover:bg-[#2d2d2d]/60" : "hover:bg-slate-100";

  // Modern searchbar styles
  const searchContainerBg = isDark
    ? "bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#2d2d2d]/50"
    : "bg-white/60 backdrop-blur-xl border border-slate-200/50";
  const searchInputBg = isDark ? "bg-[#252525]/70" : "bg-slate-100/80";
  const searchFocusRing = isDark
    ? "focus:ring-pink-500/30 focus:border-pink-500/30"
    : "focus:ring-pink-500/20 focus:border-pink-500/30";
  const searchIconColor = isDark ? "text-slate-500" : "text-slate-400";
  const clearBtnColor = isDark
    ? "text-slate-400 hover:text-slate-200"
    : "text-slate-500 hover:text-slate-700";

  // Handle clear search
  const handleClearSearch = () => {
    onSearch("");
    searchInputRef.current?.focus();
  };

  return (
    <main className={`flex-1 p-6 md:p-8 transition-colors duration-300`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl md:text-4xl font-black ${textPrimary}`}>
          {selectedCategory}
        </h1>
        <button
          onClick={onAdd}
          className={`
            flex items-center justify-center w-10 h-10 md:w-auto md:px-5 md:py-3
            rounded-full font-medium transition-all duration-200 shadow-lg
            ${
              isDark
                ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                : "bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800"
            }
            text-white focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-${isDark ? "pink-500" : "pink-500"}
            transform hover:scale-105 active:scale-95
          `}
        >
          <Plus size={18} />
          <span className="hidden md:inline ml-2">New</span>
        </button>
      </div>

      {/* MODERN SEARCH BAR */}
      <div className="mb-6">
        <div
          className={`
          relative group
          ${searchContainerBg}
          rounded-2xl overflow-hidden
          transition-all duration-300
          hover:shadow-lg
          ${searchTerm ? "shadow-lg" : ""}
        `}
        >
          {/* Left decorative gradient */}
          <div
            className={`
            absolute left-0 top-0 bottom-0 w-1
            ${
              isDark
                ? "bg-gradient-to-b from-pink-600 to-purple-600"
                : "bg-gradient-to-b from-pink-500 to-pink-600"
            }
            transition-all duration-300
            ${searchTerm ? "opacity-100" : "opacity-0 group-hover:opacity-30"}
          `}
          />

          {/* Search icon with animation */}
          <div
            className={`
            absolute left-4 top-1/2 -translate-y-1/2
            transition-all duration-300
            ${searchTerm ? "text-pink-500 scale-110" : searchIconColor}
          `}
          >
            <Search size={18} />
          </div>

          {/* Input field */}
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search ${selectedCategory !== "All" ? selectedCategory.toLowerCase() : "all"} entries...`}
            className={`
              w-full ${searchInputBg} pl-12 pr-16 py-4
              ${textPrimary} border-none outline-none
              placeholder:${searchIconColor}
              ${searchFocusRing}
              transition-all duration-300
              rounded-2xl
              focus:placeholder-opacity-50
            `}
            aria-label="Search vault entries"
          />

          {/* Search stats badge */}
          {searchTerm && (
            <div
              className={`
              absolute right-16 top-1/2 -translate-y-1/2
              px-3 py-1.5 rounded-full text-xs font-medium
              ${
                isDark
                  ? "bg-[#2d2d2d]/70 text-slate-300"
                  : "bg-slate-100 text-slate-600"
              }
              backdrop-blur-sm
              border ${isDark ? "border-[#3d3d3d]" : "border-slate-200"}
            `}
            >
              {filteredVaults.length} results
            </div>
          )}

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className={`
                absolute right-4 top-1/2 -translate-y-1/2
                p-1.5 rounded-full
                ${clearBtnColor}
                hover:bg-black/10 dark:hover:bg-white/10
                transition-all duration-200
                transform hover:scale-110
              `}
              aria-label="Clear search"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}

          {/* Category filter indicator */}
          <div
            className={`
            absolute right-4 top-1/2 -translate-y-1/2
            ${searchTerm ? "hidden" : "block"}
            text-xs font-medium
            ${isDark ? "text-slate-500" : "text-slate-400"}
            flex items-center gap-1.5
          `}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden md:inline">{selectedCategory}</span>
          </div>
        </div>

        {/* Search tips (subtle helper) */}
        {!searchTerm && (
          <p className={`mt-2 text-xs ${textSecondary} opacity-60`}>
            <span className="hidden md:inline">🔍</span> Search by title,
            username, or email
          </p>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className={`text-center py-10 ${textSecondary}`}>
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-current border-r-transparent mx-auto"></div>
            <p className="mt-2">Loading your secure vault...</p>
          </div>
        ) : filteredVaults.length > 0 ? (
          filteredVaults.map((p) => (
            <div
              key={p._id}
              onClick={() => onSelect(p)}
              className={`
                p-4 ${listItemBg} rounded-xl cursor-pointer transition-all duration-200
                ${listItemHover} border border-transparent
                ${
                  selectedEntry?._id === p._id
                    ? isDark
                      ? "border-pink-500/50 shadow-lg shadow-pink-500/10"
                      : "border-pink-400/50 shadow-lg shadow-pink-400/10"
                    : "shadow-sm"
                }
                hover:shadow-md
              `}
            >
              <h3 className={`font-semibold ${textPrimary} truncate`}>
                {p.title}
              </h3>
              <p className={`text-xs ${textSecondary} truncate`}>
                {p.username || p.email}
              </p>
            </div>
          ))
        ) : (
          <div className={`text-center py-10 ${textSecondary}`}>
            <div className="inline-block animate-pulse rounded-full h-8 w-8 border-2 border-current border-r-transparent mx-auto mb-3"></div>
            <p>No entries found</p>
            {searchTerm && (
              <p className="text-xs mt-1 opacity-70">
                Try different keywords or clear search
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
