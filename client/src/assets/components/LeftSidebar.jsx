import { DASHBOARD_CONFIG, USER_TYPES } from "../../config/dashboardConfig";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

export default function LeftSidebar({ userType = USER_TYPES.STUDENT }) {
  const config = DASHBOARD_CONFIG[userType];
  const profile = config.leftSidebar.profile;
  const menuItems = config.leftSidebar.menuItems;
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [currentProfile, setCurrentProfile] = useState(profile);

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

  // Also sync with AuthContext user changes
  useEffect(() => {
    if (authUser) {
      setCurrentProfile((prev) => ({
        ...prev,
        name: authUser.name || authUser.firstName || prev.name,
        avatar: authUser.avatar || authUser.profilePicture || prev.avatar,
      }));
    }
  }, [authUser]);

  const handleProfileClick = () => {
    if (userType === USER_TYPES.STUDENT) {
      navigate("/student/profile");
    } else if (userType === USER_TYPES.TRAINER) {
      navigate("/trainer/profile");
    } else if (userType === USER_TYPES.INSTITUTE) {
      navigate("/institute/profile");
    }
  };

  // Different stats based on user type
  const getStats = () => {
    if (userType === USER_TYPES.TRAINER) {
      return [
        {
          label: "Students",
          value: currentProfile.studentsCount,
          color: theme.statEmerald,
        },
      ];
    }
    if (userType === USER_TYPES.INSTITUTE) {
      return [
        {
          label: "Trainers",
          value: currentProfile.trainersCount,
          color: theme.statBlue,
        },
        {
          label: "Students",
          value: currentProfile.studentsCount,
          color: theme.statEmerald,
        },
      ];
    }
    return [
      {
        label: "Profile viewers",
        value: currentProfile.profileViewers,
        color: theme.statBlue,
      },
    ];
  };

  const stats = getStats();

  return (
    <div className="hidden md:block space-y-4">
      {/* Profile Card */}
      <div
        onClick={handleProfileClick}
        className={`${theme.cardBg} rounded-xl shadow-lg p-4 sm:p-5 text-center border ${theme.cardBorder} transition-all duration-300 cursor-pointer ${theme.hoverBg}`}
      >
        <div className="relative inline-block">
          <img
            src={currentProfile.avatar}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 ring-2 ${theme.accentBg}/50 ring-offset-2 ring-offset-transparent transition-all duration-300`}
            alt={currentProfile.name}
          />
          <div
            className={`absolute bottom-3 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 ${theme.isDarkMode ? "border-slate-800" : "border-white"} transition-colors duration-300`}
          ></div>
        </div>

        <h3
          className={`font-semibold text-base sm:text-lg ${theme.textPrimary} transition-colors duration-300 flex items-center justify-center gap-2`}
        >
          {currentProfile.name}
          {authUser?.isVerified && (
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" title="Verified" />
          )}
        </h3>
        <p
          className={`text-sm ${theme.accentColor} font-medium transition-colors duration-300`}
        >
          {currentProfile.role}
        </p>

        <hr
          className={`my-4 ${theme.divider} transition-colors duration-300`}
        />

        <div
          className={`grid ${stats.length > 1 ? "grid-cols-2 gap-4" : "grid-cols-1"}`}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p
                className={`text-xs ${theme.textMuted} uppercase tracking-wide transition-colors duration-300`}
              >
                {stat.label}
              </p>
              <p
                className={`text-xl font-bold ${stat.color} transition-colors duration-300`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div
        className={`${theme.cardBg} rounded-xl shadow-lg p-4 space-y-1 border ${theme.cardBorder} transition-all duration-300`}
      >
        {menuItems.map((item) => {
          const handleClick = () => {
            // Navigate based on item id and user type
            if (userType === USER_TYPES.TRAINER) {
              if (item.id === "reviews") {
                navigate("/trainer/reviews");
              }
            } else if (userType === USER_TYPES.STUDENT) {
              if (item.id === "saved-courses") {
                navigate("/student/courses");
              } else if (item.id === "groups") {
                navigate("/student/groups");
              } else if (item.id === "events") {
                navigate("/student/events");
              } else if (item.id === "certificates") {
                navigate("/student/certificates");
              }
            } else if (userType === USER_TYPES.INSTITUTE) {
              if (item.id === "find-trainers") {
                navigate("/institute/find-trainers");
              } else if (item.id === "hired-trainers") {
                navigate("/institute/hired-trainers");
              } else if (item.id === "post-job") {
                navigate("/institute/post-job");
              }
            }
          };

          return (
            <p
              key={item.id}
              onClick={handleClick}
              className={`px-3 py-2.5 rounded-lg ${theme.hoverBg} cursor-pointer transition-all duration-300 ${theme.textSecondary} ${theme.hoverText} flex items-center gap-3 hover:translate-x-1`}
            >
              <span className="text-sm">{item.label}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
