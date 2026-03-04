import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ApiService from "../../services/api";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Shield,
  Ban,
  UserCheck,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";

const AdminUsers = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    role: "",
    search: "",
    isVerified: "",
    isBanned: "",
  });
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  // Separate effect for filter changes - resets page to 1 and fetches
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Small delay to ensure page is reset before fetching
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, [filters.role, filters.isVerified, filters.isBanned]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified === "true" }),
        ...(filters.isBanned && { isBanned: filters.isBanned === "true" }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await ApiService.getAdminUsers(queryParams);
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const clearFilters = () => {
    setFilters({
      role: "",
      search: "",
      isVerified: "",
      isBanned: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleVerifyUser = async (userId, currentStatus) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await ApiService.verifyUser(userId, !currentStatus);
      if (response.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isVerified: !currentStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to verify user:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    setActionLoading((prev) => ({ ...prev, [`ban-${userId}`]: true }));
    try {
      const response = await ApiService.banUser(userId, !currentStatus);
      if (response.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, isBanned: !currentStatus, isActive: currentStatus }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to ban user:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [`ban-${userId}`]: false }));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "TRAINER":
        return "bg-blue-100 text-blue-800";
      case "INSTITUTION":
        return "bg-green-100 text-green-800";
      case "STUDENT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>User Management</h1>
          <p className="mt-1 text-2xl font-black text-black">
            Manage and moderate user accounts
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} transition-colors`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-4 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.textMuted}`} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, role: e.target.value }))
              }
              className={`px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="TRAINER">Trainer</option>
              <option value="INSTITUTION">Institution</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={filters.isVerified}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isVerified: e.target.value }))
              }
              className={`px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            <select
              value={filters.isBanned}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isBanned: e.target.value }))
              }
              className={`px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">All Status</option>
              <option value="true">Banned</option>
              <option value="false">Active</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Search
            </button>
            {(filters.role || filters.isVerified || filters.isBanned || filters.search) && (
              <button
                type="button"
                onClick={clearFilters}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} hover:scale-105 active:scale-95 transition-all duration-200`}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </form>
        
        {/* Active Filters Display */}
        {(filters.role || filters.isVerified || filters.isBanned) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className={`text-sm ${theme.textMuted}`}>Active filters:</span>
            {filters.role && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Role: {filters.role}
                <button onClick={() => setFilters((prev) => ({ ...prev, role: "" }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {filters.isVerified === "true" ? "Verified" : "Unverified"}
                <button onClick={() => setFilters((prev) => ({ ...prev, isVerified: "" }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isBanned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {filters.isBanned === "true" ? "Banned" : "Active"}
                <button onClick={() => setFilters((prev) => ({ ...prev, isBanned: "" }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-900`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme.cardBorder} ${theme.bgSecondary}`}>
                <th className={`text-left py-4 px-6 ${theme.textMuted} font-medium`}>User</th>
                <th className={`text-left py-4 px-6 ${theme.textMuted} font-medium`}>Role</th>
                <th className={`text-left py-4 px-6 ${theme.textMuted} font-medium`}>Status</th>
                <th className={`text-left py-4 px-6 ${theme.textMuted} font-medium`}>Joined</th>
                <th className={`text-right py-4 px-6 ${theme.textMuted} font-medium`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className={`mt-4 ${theme.textMuted}`}>Loading users...</p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className={`border-b ${theme.cardBorder} last:border-0 hover:${theme.hoverBg}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {user.firstName?.[0] || user.email?.[0] || "U"}
                        </div>
                        <div>
                          <p className={`font-medium ${theme.textPrimary}`}>
                            {user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : user.email}
                          </p>
                          <p className={`text-sm ${theme.textMuted}`}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-2">
                        {/* Show Verified/Unverified only for TRAINER and INSTITUTION */}
                        {(user.role === "TRAINER" || user.role === "INSTITUTION") && (
                          <>
                            {user.isVerified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <XCircle className="w-3 h-3" />
                                Unverified
                              </span>
                            )}
                          </>
                        )}
                        {/* Show Active/Banned for all users */}
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Ban className="w-3 h-3" />
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`py-4 px-6 ${theme.textSecondary}`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Verify/Unverify and Ban buttons only for TRAINER and INSTITUTION */}
                        {(user.role === "TRAINER" || user.role === "INSTITUTION") && (
                          <>
                            <button
                              onClick={() => handleVerifyUser(user.id, user.isVerified)}
                              disabled={actionLoading[user.id]}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                                user.isVerified
                                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                              } disabled:opacity-50 disabled:hover:scale-100`}
                            >
                              {actionLoading[user.id]
                                ? "..."
                                : user.isVerified
                                ? "Unverify"
                                : "Verify"}
                            </button>
                            <button
                              onClick={() => handleBanUser(user.id, user.isBanned)}
                              disabled={actionLoading[`ban-${user.id}`]}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                                user.isBanned
                                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
                                  : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
                              } disabled:opacity-50 disabled:hover:scale-100`}
                            >
                              {actionLoading[`ban-${user.id}`]
                                ? "..."
                                : user.isBanned
                                ? "Unban"
                                : "Ban"}
                            </button>
                          </>
                        )}
                        {/* Students only show Active status - no action buttons */}
                        {user.role === "STUDENT" && (
                          <span className={`text-sm ${theme.textMuted}`}>-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Users className={`w-12 h-12 ${theme.textMuted} mx-auto mb-4`} />
                    <p className={`${theme.textMuted}`}>No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className={`flex items-center justify-between px-6 py-4 border-t ${theme.cardBorder}`}>
            <p className={`text-sm ${theme.textMuted}`}>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className={`p-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className={`px-4 py-2 ${theme.textSecondary}`}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
                className={`p-2 rounded-lg border ${theme.inputBorder} ${theme.cardBg} ${theme.textSecondary} hover:${theme.hoverBg} hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
