import { DASHBOARD_CONFIG, USER_TYPES } from "../../config/dashboardConfig";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BookOpen, Users, DollarSign, Star, BarChart3,
  Search, Briefcase, TrendingUp, CreditCard, Award,
  Calendar, User,
} from "lucide-react";

const ICON_MAP = {
  BookOpen, Users, DollarSign, Star, BarChart3,
  Search, Briefcase, TrendingUp, CreditCard, Award,
  Calendar, User,
};

export default function LeftSidebar({ userType = USER_TYPES.STUDENT }) {
  const config = DASHBOARD_CONFIG[userType];
  const profile = config.leftSidebar.profile;
  const menuItems = config.leftSidebar.menuItems;
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [activeItem, setActiveItem] = useState(null);

  // Listen for profile updates from ProfilePage
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedData = event.detail;
      setCurrentProfile((prev) => ({
        ...prev,
        name: updatedData.name || prev.name,
        avatar: updatedData.avatar || prev.avatar,
        headline: updatedData.headline || prev.headline,
        location: updatedData.location || prev.location,
      }));
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  // Sync with AuthContext user changes
  useEffect(() => {
    if (authUser) {
      setCurrentProfile((prev) => ({
        ...prev,
        name: authUser.name ||
          (authUser.firstName ? `${authUser.firstName} ${authUser.lastName || ""}`.trim() : null) ||
          prev.name,
        avatar: authUser.avatar || authUser.profilePicture || prev.avatar,
      }));
    }
  }, [authUser]);

  const handleProfileClick = () => {
    if (userType === USER_TYPES.STUDENT) navigate("/student/profile");
    else if (userType === USER_TYPES.TRAINER) navigate("/trainer/profile");
    else if (userType === USER_TYPES.INSTITUTE) navigate("/institute/profile");
  };

  const getStats = () => {
    if (userType === USER_TYPES.TRAINER) {
      return [
        { label: "Students", value: currentProfile.studentsCount || "250", color: theme.statEmerald },
      ];
    }
    if (userType === USER_TYPES.INSTITUTE) {
      return [
        { label: "Trainers", value: currentProfile.trainersCount || "45", color: theme.statBlue },
        { label: "Students", value: currentProfile.studentsCount || "1200", color: theme.statEmerald },
      ];
    }
    return [
      { label: "Profile Views", value: currentProfile.profileViewers || "0", color: theme.statBlue },
    ];
  };

  const stats = getStats();
  const displayName = currentProfile.name;
  const avatarUrl = currentProfile.avatar;

  return (
    <div className="space-y-3">
      {/* Profile Card */}
      <div
        onClick={handleProfileClick}
        className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.cardBorder} overflow-hidden transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-0.5`}
      >
        {/* Cover Banner */}
        <div className="h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 relative">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
          ></div>
        </div>

        {/* Avatar + Info */}
        <div className="px-4 pb-4">
          <div className="relative -mt-9 mb-2">
            <div className="relative inline-block">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className={`w-16 h-16 rounded-full border-3 ${theme.isDarkMode ? "border-neutral-900" : "border-white"} shadow-lg object-cover ring-2 ring-blue-500/40`}
                  alt={displayName}
                />
              ) : (
                <div className={`w-16 h-16 rounded-full border-3 ${theme.isDarkMode ? "border-neutral-900" : "border-white"} shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-blue-500/40`}>
                  <User className="w-7 h-7 text-white" />
                </div>
              )}
              <div className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 ${theme.isDarkMode ? "border-neutral-900" : "border-white"}`}></div>
            </div>
          </div>

          <h3 className={`font-bold text-sm ${theme.textPrimary} leading-tight truncate group-hover:${theme.accentColor} transition-colors`}>
            {displayName}
          </h3>
          <p className={`text-xs ${theme.accentColor} font-medium mt-0.5 truncate`}>
            {currentProfile.role}
          </p>

          <div className={`border-t ${theme.divider} mt-3 pt-3 grid ${stats.length > 1 ? "grid-cols-2 gap-2" : "grid-cols-1"}`}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className={`text-xs ${theme.textMuted} uppercase tracking-wide mb-0.5`}>
                  {stat.label}
                </p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleProfileClick}
            className={`w-full mt-3 py-1.5 text-xs font-semibold ${theme.accentColor} border ${theme.cardBorder} rounded-lg ${theme.hoverBg} transition-all`}
          >
            View Profile →
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.cardBorder} overflow-hidden transition-all duration-300`}>
        <div className={`px-4 py-2.5 border-b ${theme.divider}`}>
          <p className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider`}>Menu</p>
        </div>
        <div className="p-2">
          {menuItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || BookOpen;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group ${isActive
                    ? `bg-blue-500/10 ${theme.accentColor} font-medium`
                    : `${theme.textSecondary} ${theme.hoverBg} ${theme.hoverText}`
                  }`}
              >
                <IconComponent size={16} className={isActive ? "" : `${theme.textMuted} group-hover:${theme.accentColor}`} />
                <span className="text-sm">{item.label}</span>
                {item.id === "earnings" && (
                  <span className="ml-auto text-xs font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">New</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.cardBorder} p-4 transition-all duration-300`}>
        <p className={`text-xs font-semibold ${theme.textMuted} uppercase tracking-wider mb-3`}>
          Quick Links
        </p>
        <div className="space-y-1.5">
          {[
            { label: "Explore Courses", emoji: "🎓" },
            { label: "Find Trainers", emoji: "👨‍🏫" },
            { label: "Community", emoji: "🌐" },
          ].map((link) => (
            <button
              key={link.label}
              className={`w-full flex items-center gap-2 text-xs ${theme.textSecondary} ${theme.hoverText} py-1.5 rounded transition-colors`}
            >
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
