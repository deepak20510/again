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
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : `${theme.textSecondary} hover:${theme.hoverBg}`
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
            <div className={`${theme.bgSecondary} rounded-lg p-4 space-y-3`}>
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
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm ${theme.textSecondary} hover:${theme.hoverBg} transition-colors`}
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
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await ApiService.getAdminAnalytics();
      if (response.success) {
        setStats({
          ...response.data,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${theme.textMuted} text-sm font-medium`}>{title}</p>
          <p className={`text-3xl font-bold ${theme.textPrimary} mt-1`}>
            {stats.loading ? "..." : value}
          </p>
          {subtitle && <p className={`text-sm ${theme.textMuted} mt-1`}>{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Dashboard</h1>
        <p className={`${theme.textSecondary} mt-1`}>
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

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
          icon={AlertTriangle}
          title="Pending Reports"
          value={stats.reports.pending}
          color="bg-red-600"
          subtitle="Requires attention"
        />
        <StatCard
          icon={CheckCircle}
          title="Resolved Reports"
          value={stats.reports.resolved}
          color="bg-green-600"
        />
      </div>

      {/* Recent Users */}
      <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
        <h2 className={`text-xl font-semibold ${theme.textPrimary} mb-4`}>
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
                  <tr key={user.id} className={`border-b ${theme.cardBorder} last:border-0`}>
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

export default AdminDashboard;
