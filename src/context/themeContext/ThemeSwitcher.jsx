import { Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";


const ThemeSwitcher = () => {
  const { theme } = useContext(ThemeContext);

  return <>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</>;
};

export default ThemeSwitcher;