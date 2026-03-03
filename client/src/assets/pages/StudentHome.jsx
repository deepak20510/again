import Navbar from "../components/Navbar";
import LeftSidebar from "../components/LeftSidebar";
import FeedSection from "../components/FeedSection";
import RightSidebar from "../components/RightSidebar";
import { USER_TYPES } from "../../config/dashboardConfig";
import { useTheme } from "../../context/ThemeContext";

export default function Dashboard({ userType = USER_TYPES.STUDENT }) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.bg} min-h-screen transition-colors duration-300`}>
      <Navbar userType={userType} />

      {/* 3 Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6 mt-6 pb-10">
        {/* Left - Sticky Sidebar */}
        <div className="col-span-3">
          <div className="sticky top-20">
            <LeftSidebar userType={userType} />
          </div>
        </div>

        {/* Center - Scrollable Feed */}
        <div className="col-span-6">
          <FeedSection userType={userType} />
        </div>

        {/* Right - Sticky Sidebar */}
        <div className="col-span-3">
          <div className="sticky top-20">
            <RightSidebar userType={userType} />
          </div>
        </div>
      </div>
    </div>
  );
}
