import './index.css'
import './App.css'
import RootLayout from './components/layout/RootLayout.jsx'
import Header from './fixed/Header.jsx'
import { Outlet } from 'react-router'
import { useContext } from 'react'
import { ThemeContext } from './context/themeContext/ThemeContext.jsx'
function App() {
  const {theme}=useContext(ThemeContext);
  const isDark=theme==="dark";
  return (
    <div className={`min-h-screen w-full transition-colors duration-300
        ${
          isDark
            ? "bg-linear-to-br from-slate-900 via-slate-800 to-gray-800 text-white"
            : "bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900"
        }`}> 
    <Header/>
      <Outlet/>
    </div>
  )
}

export default App
