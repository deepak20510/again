import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ApiService from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  UserCheck,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Calendar,
  RefreshCw,
} from "lucide-react";

const AdminAnalytics = () => {
  const { theme } = useTheme();
  const [data, setData] = useState({
    overview: {},
    reports: {},
    usersByRole: [],
    dailyRegistrations: [],
    loading: true,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await ApiService.getAdminAnalytics();
      if (response.success) {
        setData({
          ...response.data,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`${theme.textMuted} text-sm font-medium`}>{title}</p>
          <p className={`text-3xl font-bold ${theme.textPrimary} mt-1`}>
            {data.loading ? "..." : value}
          </p>
          {subtitle && <p className={`text-sm ${theme.textMuted} mt-1`}>{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

  // Format daily registrations data for chart
  const registrationChartData = data.dailyRegistrations?.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: parseInt(item.count),
  })) || [];

  // Format users by role for pie chart
  const roleChartData = data.usersByRole?.map((item) => ({
    name: item.role,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>Analytics Overview</h1>
          <p className="mt-1 text-2xl font-black text-black">
            Platform performance and user statistics
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} transition-colors`}
        >
          <RefreshCw className={`w-4 h-4 ${data.loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Users"
          value={data.overview.totalUsers}
          subtitle={`+${data.overview.newUsersLast30Days || 0} this month`}
          color="bg-blue-600"
        />
        <StatCard
          icon={UserCheck}
          title="Trainers"
          value={data.overview.totalTrainers}
          subtitle="Active professionals"
          color="bg-indigo-600"
        />
        <StatCard
          icon={BookOpen}
          title="Materials"
          value={data.overview.totalMaterials}
          subtitle="Learning resources"
          color="bg-green-600"
        />
        <StatCard
          icon={ClipboardList}
          title="Bookings"
          value={data.overview.totalRequests}
          subtitle="Total requests"
          color="bg-amber-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registrations Chart */}
        <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className={`w-5 h-5 ${theme.textMuted}`} />
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
              User Registrations (Last 30 Days)
            </h2>
          </div>
          <div className="h-64">
            {data.loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : registrationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.cardBorder.replace("border-", "")} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: theme.textMuted.replace("text-", ""), fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: theme.textMuted.replace("text-", ""), fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.cardBg.replace("bg-", ""),
                      border: `1px solid ${theme.cardBorder.replace("border-", "")}`,
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: theme.textPrimary.replace("text-", "") }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className={`${theme.textMuted}`}>No registration data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Users by Role Pie Chart */}
        <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <Users className={`w-5 h-5 ${theme.textMuted}`} />
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Users by Role</h2>
          </div>
          <div className="h-64">
            {data.loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.cardBg.replace("bg-", ""),
                      border: `1px solid ${theme.cardBorder.replace("border-", "")}`,
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className={`${theme.textMuted}`}>No role data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Overview */}
        <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <ClipboardList className={`w-5 h-5 ${theme.textMuted}`} />
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Reports Overview</h2>
          </div>
          <div className="h-64">
            {data.loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Pending", value: data.reports.pending || 0 },
                    { name: "Resolved", value: data.reports.resolved || 0 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.cardBorder.replace("border-", "")} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: theme.textMuted.replace("text-", ""), fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: theme.textMuted.replace("text-", ""), fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.cardBg.replace("bg-", ""),
                      border: `1px solid ${theme.cardBorder.replace("border-", "")}`,
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    <Cell fill="#F59E0B" />
                    <Cell fill="#10B981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Platform Summary */}
        <div className={`${theme.cardBg} rounded-lg border ${theme.cardBorder} p-6`}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className={`w-5 h-5 ${theme.textMuted}`} />
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Platform Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b ${theme.cardBorder}">
              <span className={theme.textSecondary}>Total Students</span>
              <span className={`font-semibold ${theme.textPrimary}`}>
                {data.overview.totalStudents || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b ${theme.cardBorder}">
              <span className={theme.textSecondary}>Total Institutions</span>
              <span className={`font-semibold ${theme.textPrimary}`}>
                {data.overview.totalInstitutions || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b ${theme.cardBorder}">
              <span className={theme.textSecondary}>Pending Reports</span>
              <span className={`font-semibold ${data.reports.pending > 0 ? "text-red-500" : theme.textPrimary}`}>
                {data.reports.pending || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b ${theme.cardBorder}">
              <span className={theme.textSecondary}>Resolved Reports</span>
              <span className={`font-semibold text-green-600`}>
                {data.reports.resolved || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className={theme.textSecondary}>New Users (Last 30 Days)</span>
              <span className={`font-semibold ${theme.textPrimary}`}>
                {data.overview.newUsersLast30Days || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
