import {
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BookOpen,
  DollarSign,
  UserPlus,
  BarChart3,
  Search,
  TrendingUp,
  CreditCard,
  Building2,
  Sun,
  Moon,
} from "lucide-react";
import { DASHBOARD_CONFIG, USER_TYPES } from "../../config/dashboardConfig";
import { useTheme } from "../../context/ThemeContext";

const ICON_MAP = {
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BookOpen,
  DollarSign,
  UserPlus,
  BarChart3,
  Search,
  TrendingUp,
  CreditCard,
  Building2,
};

export default function Navbar({ userType = USER_TYPES.STUDENT }) {
  const config = DASHBOARD_CONFIG[userType];
  const navItems = config.navbar.navItems;
  const { isDarkMode, toggleTheme, theme } = useTheme();

  const getIcon = (iconName) => {
    return ICON_MAP[iconName] || Users;
  };

  return (
    <header
      className={`${theme.navbarBg} shadow-lg sticky top-0 z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-8 py-3 flex justify-between items-center gap-0">
        <div className="flex items-center gap-3">
          <Building2
            className={`${theme.accentColor} w-7 h-7 transition-colors duration-300`}
          />
          <h1 className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold text-xl">
            Tutroid
          </h1>
        </div>

        <div className="relative">
          <Search
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted} w-4 h-4 transition-colors duration-300`}
          />
          <input
            placeholder="Search trainers, courses, institutes..."
            className={`${theme.inputBg} border ${theme.inputBorder} pl-10 pr-4 py-2.5 rounded-full w-96 outline-none ${theme.inputText} ${theme.inputPlaceholder} focus:border-blue-400 transition-all duration-300`}
          />
        </div>

        <div className="flex items-center gap-6">
          {/* Nav Items */}
          <div
            className={`flex gap-6 ${theme.textSecondary} transition-colors duration-300`}
          >
            {navItems.map((item) => {
              const IconComponent = getIcon(item.icon);
              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center gap-1 cursor-pointer group px-2 py-1 rounded-lg ${theme.hoverBg} transition-all duration-300`}
                >
                  <IconComponent
                    size={22}
                    className={`${theme.hoverText} transition-colors duration-300`}
                  />
                  <span
                    className={`text-xs ${theme.textMuted} ${theme.hoverText} transition-colors duration-300 font-medium`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Theme Toggle - More Visible */}
          <button
            onClick={toggleTheme}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              isDarkMode
                ? "bg-blue-500/20 border border-blue-400/50 text-blue-400 hover:bg-blue-500/30"
                : "bg-amber-100 border border-amber-300 text-amber-600 hover:bg-amber-200"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="relative w-5 h-5">
              <Sun
                size={18}
                className={`absolute inset-0 transition-all duration-300 ${
                  isDarkMode
                    ? "opacity-0 rotate-90 scale-50"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <Moon
                size={18}
                className={`absolute inset-0 transition-all duration-300 ${
                  isDarkMode
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-50"
                }`}
              />
            </div>
            <span
              className={`text-xs font-semibold ${isDarkMode ? "text-blue-400" : "text-amber-600"}`}
            >
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
