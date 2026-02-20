import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from './components/form/Login.jsx';
import RootLayout from './components/layout/RootLayout.jsx';
import Signup from './components/form/Signup.jsx';
import { ThemeProvider } from './context/themeContext/ThemeContext.jsx';
import AuthProvider from './context/AuthContext/AuthProvider.jsx';
import PrivateRoute from './components/routes/PrivateRoute.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [{
      path: "/",
      element: <PrivateRoute><RootLayout/></PrivateRoute>
    },   
  ]
  },
  {
    path: "/login",
    element: <Login/>
    },
    {
      path:"/signup",
      element: <Signup/>
    }
  
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider><ThemeProvider><RouterProvider router={router} /></ThemeProvider></AuthProvider>
  </StrictMode>,
)
