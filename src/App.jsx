import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import VendorDashboard from "./pages/VendorDashboard";
import ChatWidget from "./components/ChatWidget";
import AIHelper from "./components/AIHelper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./AuthProvider";
import { useTranslation } from "react-i18next";

function Nav() {
  const { i18n, t } = useTranslation();
  const { user, logout } = useAuth();
  return (
    <nav className="mb-4">
      <Link to="/">{t("nav.home")}</Link>
      <Link to="/vendor">{t("nav.profile")}</Link>
      <Link to="/chat">{t("nav.chat")}</Link>
      <Link to="/ai">{t("nav.ai")}</Link>
      <button className="ml-4" onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}>
        {i18n.language === "en" ? "???????" : "English"}
      </button>
      {user ? <button onClick={logout} className="ml-2">Logout</button> : <Link to="/login" className="ml-2">Login</Link>}
    </nav>
  );
}

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <AuthProvider>
      <div className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/chat" element={<ChatWidget />} />
          <Route path="/ai" element={<AIHelper />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
