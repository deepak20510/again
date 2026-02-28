import { DASHBOARD_CONFIG, USER_TYPES } from "../../config/dashboardConfig";
import { useTheme } from "../../context/ThemeContext";

export default function RightSidebar({ userType = USER_TYPES.STUDENT }) {
  const config = DASHBOARD_CONFIG[userType];
  const sidebarConfig = config.rightSidebar;
  const { theme } = useTheme();

  return (
    <div
      className={`${theme.cardBg} rounded-xl shadow-lg p-5 sticky top-24 border ${theme.cardBorder} transition-all duration-300`}
    >
      <h3
        className={`font-semibold mb-4 text-lg ${theme.textPrimary} border-b ${theme.divider} pb-3 transition-colors duration-300`}
      >
        {sidebarConfig.title}
      </h3>

      <ul
        className={`space-y-3 text-sm ${theme.textSecondary} transition-colors duration-300`}
      >
        {sidebarConfig.items.map((item, index) => (
          <li
            key={index}
            className={`${theme.hoverText} cursor-pointer transition-all duration-300 hover:translate-x-1 flex items-center gap-2`}
          >
            <span
              className={`w-1.5 h-1.5 ${theme.accentBg} rounded-full transition-colors duration-300`}
            ></span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
