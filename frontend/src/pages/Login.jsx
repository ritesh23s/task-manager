import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);

      if (res.data.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card auth-card" style={{ maxWidth: 420 }}>
        {/* HEADER */}
        <h2 style={{ marginBottom: 4 }}>Welcome back .!</h2>
        <p
          style={{
            fontSize: 14,
            opacity: 0.75,
            marginBottom: 24,
          }}
        >
          Please login to your account
        </p>

        {/* FORM */}
        <form onSubmit={submit}>
          {/* EMAIL */}
          <label style={{ fontSize: 18, opacity: 0.7 }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            autoComplete="email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          {/* PASSWORD */}
          <label
            style={{
              fontSize: 18,
              opacity: 0.7,
              marginTop: 12,
              display: "block",
            }}
          >
            Password
          </label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              autoComplete="current-password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: 12,
                opacity: 0.7,
                userSelect: "none",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          {/* ACTION */}
          <button
            disabled={loading}
            style={{
              marginTop: 18,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* LINKS */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 15.5,
          }}
        >
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
        
        {/* FOOTER */}
        <p
          style={{
            marginTop: 20,
            fontSize: 12,
            opacity: 0.6,
            textAlign: "center",
          }}
        >
          &#128272; Secure login  Encrypted authentication
        </p>
      </div>
    </div>
  );
};

export default Login;
