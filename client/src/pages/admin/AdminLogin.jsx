import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft, KeyRound, RefreshCw } from "lucide-react";

const AdminLogin = () => {
  const { theme } = useTheme();
  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // email -> otp -> reset
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Forgot password handlers
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.adminForgotPassword({ email: forgotEmail });
      if (response.success) {
        if (response.exists) {
          setSuccess(response.message);
          setForgotStep("otp");
          setResendTimer(60); // 60 seconds cooldown
        } else {
          setError(response.message || "No admin account found with this email.");
        }
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.adminVerifyResetOTP({ email: forgotEmail, otp });
      if (response.success) {
        setSuccess(response.message);
        setForgotStep("reset");
      } else {
        setError(response.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await ApiService.adminResetPassword({
        email: forgotEmail,
        otp,
        newPassword,
      });
      if (response.success) {
        setSuccess(response.message);
        // Reset form and go back to login after a delay
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotStep("email");
          setForgotEmail("");
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setSuccess("");
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.adminForgotPassword({ email: forgotEmail });
      if (response.success && response.exists) {
        setSuccess("OTP resent successfully. Please check your inbox.");
        setResendTimer(60);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setResendTimer(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // If already logged in as non-admin, logout first
      if (isAuthenticated && user?.role !== "ADMIN") {
        logout();
      }

      const response = await login(formData);
      
      if (response.success) {
        // Check if user is admin
        if (response.data?.user?.role === "ADMIN") {
          navigate("/admin");
        } else {
          setError("Access denied. Admin privileges required.");
          // Logout if not admin
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Render forgot password UI
  if (showForgotPassword) {
    return (
      <div className={`min-h-screen ${theme.bgPrimary} flex items-center justify-center p-4`}>
        <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} shadow-xl w-full max-w-md p-8`}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
              Reset Admin Password
            </h1>
            <p className={`${theme.textSecondary} mt-2`}>
              {forgotStep === "email" && "Enter your admin email to receive OTP"}
              {forgotStep === "otp" && "Enter the 6-digit OTP sent to your email"}
              {forgotStep === "reset" && "Create a new password for your account"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Step 1: Email Form */}
          {forgotStep === "email" && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {forgotStep === "otp" && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  Enter OTP
                </label>
                <div className="relative">
                  <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest`}
                    required
                  />
                </div>
                <p className={`text-xs ${theme.textMuted} mt-2 text-center`}>
                  OTP sent to {forgotEmail}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Verify OTP
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`text-sm ${resendTimer > 0 ? theme.textMuted : "text-blue-600 hover:text-blue-700"} transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading && "animate-spin"}`} />
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {forgotStep === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textMuted} hover:${theme.textSecondary}`}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={resetForgotPassword}
              className={`flex items-center justify-center gap-2 w-full text-sm ${theme.textMuted} hover:${theme.textSecondary} transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>

          {/* Security Notice */}
          <div className={`mt-8 pt-6 border-t ${theme.cardBorder} text-center`}>
            <p className={`text-xs ${theme.textMuted}`}>
              Secure password reset for authorized administrators only.
              <br />
              All reset attempts are logged and monitored.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgPrimary} flex items-center justify-center p-4`}>
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} shadow-xl w-full max-w-md p-8`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
            Admin Portal
          </h1>
          <p className={`${theme.textSecondary} mt-2`}>
            Secure access for administrators only
          </p>
          {isAuthenticated && user?.role !== "ADMIN" && (
            <p className="mt-3 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full inline-block">
              Currently logged in as {user?.role}. Please login as Admin.
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
              Admin Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${theme.textMuted} hover:${theme.textSecondary}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className={`text-sm text-blue-600 hover:text-blue-700 transition-colors`}
          >
            Forgot Password?
          </button>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => navigate("/")}
            className={`flex items-center justify-center gap-2 w-full text-sm ${theme.textMuted} hover:${theme.textSecondary} transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Security Notice */}
        <div className={`mt-8 pt-6 border-t ${theme.cardBorder} text-center`}>
          <p className={`text-xs ${theme.textMuted}`}>
            This area is restricted to authorized personnel only.
            <br />
            All login attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
