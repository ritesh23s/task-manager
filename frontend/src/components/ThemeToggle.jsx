import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeToggle = () => {
  const location = useLocation();
  const hideOnAuth =
    location.pathname === "/login" ||
    location.pathname === "/register";

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (hideOnAuth) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "light" ? "dark" : "light")
      }
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "auto",
        padding: "8px 14px",
        zIndex: 1000,
      }}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default ThemeToggle;
