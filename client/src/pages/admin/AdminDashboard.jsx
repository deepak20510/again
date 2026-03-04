import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/api";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  UserCog,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrainers: 0,
    totalInstitutions: 0,
    pendingReports: 0,
    loading: true,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await ApiService.getAdminAnalytics();
      if (response.success) {
        setStats({
          totalUsers: response.data.overview.totalUsers,
          totalTrainers: response.data.overview.totalTrainers,
          totalInstitutions: response.data.overview.totalInstitutions,
          pendingReports: response.data.reports.pending,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin"); // Redirect to admin login (same page)
  };

  const navItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
      badge: null,
    },
    {
      path: "/admin/reports",
      label: "Reports",
      icon: FileText,
      badge: stats.pendingReports > 0 ? stats.pendingReports : null,
    },
    {
      path: "/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      path: "/admin/settings",
      label: "Settings",
      icon: UserCog,
    },
  ];

  return (
    <div className={`min-h-screen ${theme.bgPrimary}`}>
      {/* Mobile Header */}
      <div className={`lg:hidden ${theme.cardBg} border-b ${theme.cardBorder} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className={`font-bold text-lg ${theme.textPrimary}`}>Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg ${theme.hoverBg}`}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:static lg:translate-x-0 z-40 w-64 h-screen ${theme.cardBg} border-r ${theme.cardBorder} transition-transform duration-200 ease-in-out`}
        >
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 p-6 border-b ${theme.cardBorder}">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className={`font-bold text-xl ${theme.textPrimary}`}>Admin</h1>
              <p className={`text-xs ${theme.textMuted}`}>Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : `${theme.textSecondary} hover:${theme.hoverBg} hover:translate-x-1`
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 mt-auto">
            <div className={`${theme.bgSecondary} rounded-xl p-4 space-y-3 hover:bg-gray-800/70 transition-colors duration-200`}>
              <h3 className={`text-sm font-medium ${theme.textMuted}`}>Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={theme.textSecondary}>Total Users</span>
                  <span className={`font-medium ${theme.textPrimary}`}>
                    {stats.loading ? "..." : stats.totalUsers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme.textSecondary}>Trainers</span>
                  <span className={`font-medium ${theme.textPrimary}`}>
                    {stats.loading ? "..." : stats.totalTrainers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme.textSecondary}>Pending Reports</span>
                  <span className={`font-medium ${stats.pendingReports > 0 ? "text-red-500" : theme.textPrimary}`}>
                    {stats.loading ? "..." : stats.pendingReports}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className={`p-4 border-t ${theme.cardBorder} mt-auto`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {user?.firstName?.[0] || user?.email?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${theme.textPrimary} truncate`}>
                  {user?.firstName || user?.email}
                </p>
                <p className={`text-xs ${theme.textMuted}`}>Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm ${theme.textSecondary} hover:${theme.hoverBg} hover:text-red-500 transition-all duration-200 hover:translate-x-1`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Default dashboard view when at /admin
export const AdminOverview = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    overview: {},
    reports: {},
    usersByRole: [],
    recentUsers: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));
      const response = await ApiService.getAdminAnalytics();
      if (response.success) {
        setStats({
          ...response.data,
          loading: false,
          error: null,
        });
      } else {
        setStats((prev) => ({ 
          ...prev, 
          loading: false, 
          error: response.message || "Failed to load analytics" 
        }));
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setStats((prev) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || "Failed to load analytics" 
      }));
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900 hover:from-gray-750 hover:to-gray-850`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${theme.textMuted} text-sm font-medium uppercase tracking-wider`}>{title}</p>
          <p className={`text-3xl font-bold ${theme.textPrimary} mt-2`}>
            {stats.loading ? "..." : value || 0}
          </p>
          {subtitle && <p className={`text-sm ${theme.textMuted} mt-2`}>{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Dashboard</h1>
          <p className="mt-1 text-2xl font-black text-black">
  Welcome back! Here's what's happening with your platform.
</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={stats.loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} transition-colors disabled:opacity-50`}
        >
          <RefreshCw className={`w-4 h-4 ${stats.loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {stats.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{stats.error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.overview.totalUsers}
          color="bg-blue-600"
          subtitle={`+${stats.overview.newUsersLast30Days || 0} this month`}
        />
        <StatCard
          icon={Shield}
          title="Trainers"
          value={stats.overview.totalTrainers}
          color="bg-indigo-600"
        />
        <StatCard
          icon={CheckCircle}
          title="Institutions"
          value={stats.overview.totalInstitutions}
          color="bg-green-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Pending Reports"
          value={stats.reports.pending}
          color="bg-red-600"
          subtitle="Requires attention"
        />
      </div>

      {/* Recent Users */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-4 flex items-center gap-2`}>
          <Users className="w-5 h-5 text-blue-500" />
          Recent Registrations
        </h2>
        {stats.loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : stats.recentUsers?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme.cardBorder}`}>
                  <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium`}>User</th>
                  <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium`}>Role</th>
                  <th className={`text-left py-3 px-4 ${theme.textMuted} font-medium`}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className={`border-b ${theme.cardBorder} last:border-0 hover:bg-gray-800/50 dark:hover:bg-gray-800/50 transition-colors duration-200`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {user.firstName?.[0] || user.email?.[0] || "U"}
                        </div>
                        <div>
                          <p className={`font-medium ${theme.textPrimary}`}>
                            {user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : user.email}
                          </p>
                          {user.firstName && (
                            <p className={`text-sm ${theme.textMuted}`}>{user.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "TRAINER"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "INSTITUTION"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${theme.textMuted}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`${theme.textMuted} text-center py-8`}>No recent registrations</p>
        )}
      </div>
    </div>
  );
};

// Settings page with Transfer Admin feature
export const AdminSettings = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransferAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await ApiService.transferAdmin({
        newAdminEmail,
        currentPassword,
      });

      if (response.success) {
        setSuccess("Admin privileges transferred successfully! You will be logged out.");
        setTimeout(() => {
          logout();
          navigate("/admin/login");
        }, 3000);
      } else {
        setError(response.message || "Failed to transfer admin privileges");
      }
    } catch (err) {
      setError(err.message || "Failed to transfer admin privileges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Admin Settings</h1>
          <p className="mt-1 text-2xl font-black text-black">
          Manage admin account and transfer privileges.
        </p>
      </div>

      {/* Current Admin Info */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-300 g-linear-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-4`}>
          Current Admin
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-medium">
            {user?.firstName?.[0] || user?.email?.[0] || "A"}
          </div>
          <div>
            <p className={`text-lg font-medium ${theme.textPrimary}`}>
              {user?.firstName || user?.email}
            </p>
            <p className={`${theme.textMuted}`}>{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Transfer Admin Section */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-4`}>
          Transfer Admin Privileges
        </h2>
        <p className={`${theme.textSecondary} mb-6`}>
          Transfer your admin privileges to another user. This action cannot be undone. 
          You will be demoted to a regular student account after the transfer.
        </p>

        {!showTransferModal ? (
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Transfer Admin Rights
          </button>
        ) : (
          <div className={`${theme.bgSecondary} rounded-xl p-6 bg-gray-800/50 dark:bg-gray-800/50`}>
            <h3 className={`text-lg font-medium ${theme.textPrimary} mb-4`}>
              Confirm Admin Transfer
            </h3>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleTransferAdmin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  New Admin Email
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter email of the new admin"
                  className={`w-full px-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <p className={`text-xs ${theme.textMuted} mt-1`}>
                  The user must already have an account on the platform.
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
                  Your Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your password to confirm"
                  className={`w-full px-4 py-3 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className={`flex-1 px-6 py-3 border ${theme.cardBorder} rounded-lg font-medium ${theme.textSecondary} hover:${theme.hoverBg} transition-colors`}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Transferring..." : "Confirm Transfer"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <h3 className={`text-lg font-medium ${theme.textPrimary} mb-3`}>
          How to Transfer Admin Rights
        </h3>
        <ol className={`list-decimal list-inside space-y-2 ${theme.textSecondary}`}>
          <li>Enter the email address of the user who will become the new admin</li>
          <li>The user must already have an account (Student, Trainer, or Institution)</li>
          <li>Enter your current password to confirm the transfer</li>
          <li>Click "Confirm Transfer" to complete the process</li>
          <li>You will be logged out and your account will become a Student account</li>
          <li>The new admin can login with their existing credentials</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminDashboard;
