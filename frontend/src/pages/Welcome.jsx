import { Link, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

const Welcome = () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      return (
        <Navigate to={decoded.role === "admin" ? "/admin" : "/dashboard"} />
      );
    } catch {
      localStorage.removeItem("token");
    }
  }

  return (
    <div
      className="container"
      style={{
        position: "relative",
        background: "var(--bg)",
      }}
    >
      {/* THEME TOGGLE */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <motion.div
        style={{
          maxWidth: 900,
          textAlign: "center",
          margin: "0 auto",
          paddingTop: 60,
        }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* HERO */}
        <motion.h1
          style={{
            fontSize: "3rem",
            marginBottom: 12,
            lineHeight: 1.2,
            color: "var(--text)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Manage Tasks. Stay Productive.
        </motion.h1>

        <motion.p
          style={{
            fontSize: 18,
            opacity: 0.85,
            marginBottom: 35,
            maxWidth: 650,
            marginInline: "auto",
            color: "var(--text-muted)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          A modern task manager with role-based access, analytics & full control.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <Link to="/register">
            <motion.button
              style={{
                width: "auto",
                padding: "13px 30px",
                boxShadow: "0 12px 28px var(--shadow)",
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>

          <Link to="/login">
            <motion.button
              style={{
                width: "auto",
                padding: "13px 30px",
                background: "transparent",
                border: "2px solid var(--primary)",
                color: "var(--primary)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </Link>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          style={{
            marginTop: 70,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 22,
          }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {[
            {
              title: "Role Based Access",
              desc: "Admin & User dashboards with full control",
            },
            {
              title: "Analytics",
              desc: "Track users & task performance easily",
            },
            {
              title: "Fast & Secure",
              desc: "JWT authentication with secure APIs",
            },
            {
              title: "Responsive UI",
              desc: "Works smoothly on all devices",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 32px var(--shadow)",
              }}
            >
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* FINAL CTA */}
        <motion.div
          style={{
            marginTop: 70,
            paddingTop: 45,
            borderTop: "1px solid var(--border)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={{ color: "var(--text)" }}>
            Ready to take control of your work?
          </h2>

          <Link to="/register">
            <motion.button
              style={{ width: "auto", marginTop: 18 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Free Account
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome;
