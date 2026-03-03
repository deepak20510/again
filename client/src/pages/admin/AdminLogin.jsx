import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle, ArrowLeft } from "lucide-react";

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

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
