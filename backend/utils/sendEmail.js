const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// SEND VERIFY EMAIL OTP AT REGISTER TIME
const sendVerifyEmailOTP = async (to, otp) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email - Task Manager",
    html: `
      <div style="font-family:Arial;max-width:500px">
        <h2>Verify Your Email 📧</h2>
        <p>Use the OTP below to verify your email:</p>

        <h1 style="letter-spacing:5px">${otp}</h1>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
      </div>
    `,
  });
};


// PASSWORD RESET OTP

const sendOTPEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Task Manager" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset OTP - Task Manager",
    html: `
      <div style="max-width:600px;margin:auto;font-family:Arial;background:#f9fafb;padding:20px">
        <div style="background:#ffffff;border-radius:8px;padding:30px">
          <h2 style="color:#111827;text-align:center">
            🔐 Password Reset Request
          </h2>

          <p style="font-size:15px;color:#374151">
            We received a request to reset your password.  
            Use the OTP below to proceed:
          </p>

          <div style="
            font-size:32px;
            letter-spacing:6px;
            text-align:center;
            font-weight:bold;
            margin:25px 0;
            color:#2563eb;
          ">
            ${otp}
          </div>

          <p style="font-size:14px;color:#6b7280">
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <hr style="margin:20px 0"/>

          <p style="font-size:13px;color:#9ca3af">
            If you didn't request this password reset, you can safely ignore this email.
          </p>

          <p style="font-size:13px;color:#9ca3af;text-align:center;margin-top:20px">
            © ${new Date().getFullYear()} Task Manager
          </p>
        </div>
      </div>
    `,
  });
};

// PASSWORD RESET SUCCESS EMAIL

const sendPasswordResetSuccessEmail = async (to) => {
  await transporter.sendMail({
    from: `"Task Manager Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Successful",
    html: `
      <div style="font-family: Arial; max-width: 500px">
        <h2>Password Changed Successfully ✅</h2>
        <p>Your password has been reset successfully.</p>

        <a href="http://localhost:5173/login"
           style="
             display:inline-block;
             margin-top:15px;
             padding:10px 20px;
             background:#2563eb;
             color:white;
             text-decoration:none;
             border-radius:5px;
           ">
           Login Now
        </a>

        <p style="margin-top:20px; font-size:13px; color:#555">
          If you did not perform this action, please contact support immediately.
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetSuccessEmail,
  sendVerifyEmailOTP,
};

