import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import VaultList from "../vault/VaultList";
import DetailPane from "../vault/DetailPane";
import NewEntryModal from "../vault/NewEntryModal";
import { ThemeContext } from "../../context/themeContext/ThemeContext";
import { AuthContext } from "../../context/AuthContext/AuthContext";

export default function RootLayout() {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  const [vaults, setVaults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH ONCE ---------------- */
  useEffect(() => {
    if (!user?.email) {
      setVaults([]);
      return;
    }

    setLoading(true);
    axios
      .get("https://vault-server-blue.vercel.app/vaults", {
        params: { userEmail: user.email },
      })
      .then((res) => setVaults(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Vault fetch failed:", err))
      .finally(() => setLoading(false));
  }, [user?.email]);

  /* ---------------- MUTATIONS ---------------- */
  const addEntry = (newEntry) => {
    setVaults((prev) => [newEntry, ...prev]);
  };

  const deleteEntry = (id) => {
    setVaults((prev) => prev.filter((v) => v._id !== id));
    setSelectedEntry(null);
  };

  /* ---------------- FILTERING ---------------- */
  const filteredVaults = useMemo(() => {
    return vaults.filter((v) => {
      const matchCategory =
        selectedCategory === "All" || v.category === selectedCategory;

      const matchSearch =
        !searchTerm ||
        v.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.username?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [vaults, selectedCategory, searchTerm]);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        Please log in
      </div>
    );
  }

  return (
    <div className={`h-screen ${isDark ? "bg-[#121212]" : "bg-[#f9fafb]"}`}>
      <div className="pt-20 h-full flex">
        <Sidebar
          passwords={vaults}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <VaultList
          entries={filteredVaults}
          totalEntries={vaults.length}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          selectedCategory={selectedCategory}
          selectedEntry={selectedEntry}
          onSelect={setSelectedEntry}
          onAdd={() => setIsModalOpen(true)}
          loading={loading}
        />

        <DetailPane
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDelete={deleteEntry}
        />
      </div>

      {isModalOpen && (
        <NewEntryModal
          onClose={() => setIsModalOpen(false)}
          onCreated={addEntry}
        />
      )}
    </div>
  );
}
