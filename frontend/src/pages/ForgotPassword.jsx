import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ======================
  // SEND OTP
  // ======================
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // RESET PASSWORD
  // ======================
  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMessage(res.data.message);

      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card auth-card"
        style={{
          maxWidth: 440,
          width: "100%",
          padding: "32px",
          borderRadius: 16,
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* STEP INDICATOR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginBottom: 22,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: step === 1 ? "#2563eb" : "#d1d5db",
            }}
          />
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: step === 2 ? "#2563eb" : "#d1d5db",
            }}
          />
        </div>

        {/* HEADER */}
        <h2 style={{ textAlign: "center" }}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            opacity: 0.75,
            marginBottom: 28,
          }}
        >
          {step === 1
            ? "We'll send a secure OTP to your registered email"
            : "Verify OTP and create a new secure password"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOTP}>
            <label style={{ fontSize: 13 }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && (
              <p style={{ color: "#dc2626", fontSize: 13 }}>
                {error}
              </p>
            )}

            <button
              style={{ marginTop: 18 }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              <Link to="/login">Back to login</Link>
            </div>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={resetPassword}>
            <p
              style={{
                fontSize: 13,
                marginBottom: 14,
                opacity: 0.8,
              }}
            >
               OTP sent to <b>{email}</b>
            </p>

            <label style={{ fontSize: 13 }}>OTP</label>
            <input
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <label
              style={{
                fontSize: 13,
                marginTop: 14,
                display: "block",
              }}
            >
              New Password
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New secure password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
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
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {error && (
              <p style={{ color: "#dc2626", fontSize: 13 }}>
                {error}
              </p>
            )}

            {message && (
              <p style={{ color: "#dc2626", fontSize: 13 }}>
                {message}
              </p>
            )}

            <button
              style={{ marginTop: 20 }}
              disabled={loading}
            >
              {loading
                ? "Updating password..."
                : "Reset Password"}
            </button>

            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              <Link to="/login">Login instead</Link>
            </div>
          </form>
        )}

        {/* FOOTER */}
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            opacity: 0.6,
            marginTop: 24,
          }}
        >
          &#128272; Secured by OTP verification
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
