import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // STEP CONTROL
  const [step, setStep] = useState(1);

  // FORM DATA
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // PASSWORD UX
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // ======================
  // PASSWORD VALIDATION
  // ======================
  const validatePassword = (password) => {
    const strong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strong.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number & special character"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  // ======================
  // STEP 1: SEND OTP
  // ======================
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/register", {
        email: form.email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // STEP 2: VERIFY OTP (UI ONLY)
  // ======================
  const verifyOTP = (e) => {
    e.preventDefault();
    if (!otp) return;
    setStep(3);
  };

  // ======================
  // STEP 3: COMPLETE REGISTER
  // ======================
  const completeRegister = async (e) => {
    e.preventDefault();

    if (!validatePassword(form.password)) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/register/verify-email", {
        ...form,
        otp,
      });

      setMessage("🎉 Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // UI
  // ======================
  return (
    <div className="container">
      <div className="card auth-card" style={{ maxWidth: 440 }}>

        {/* STEP INDICATOR */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          {["Email", "OTP", "Details"].map((label, index) => (
            <div
              key={label}
              style={{
                fontSize: 12,
                fontWeight: step === index + 1 ? "bold" : "normal",
                color: step >= index + 1 ? "#2563eb" : "#9ca3af",
              }}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>

        <h2 style={{ textAlign: "center" }}>
          {step === 1 && "Verify Your Email"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Create Account"}
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOTP}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
            <p style={{ fontSize: 12, opacity: 0.75 }}>
              We'll send a verification OTP to this email.
            </p>

            <button disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={verifyOTP}>
            <label>Email</label>
            <input value={form.email} disabled />

            <label>OTP</label>
            <input
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={completeRegister}>
            <label>Full Name</label>
            <input
              placeholder="Your full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              required
            />

            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Strong password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  validatePassword(e.target.value);
                }}
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
                  opacity: 0.7,
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {passwordError && (
              <p style={{ color: "red", fontSize: 12 }}>{passwordError}</p>
            )}

            <button disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: 12, fontSize: 14, color: "#2563eb" }}>
            {message}
          </p>
        )}

        <div className="link" style={{ marginTop: 18, textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
