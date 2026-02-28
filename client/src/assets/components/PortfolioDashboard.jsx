import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Calendar,
  Filter,
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

export default function PortfolioDashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [earnings, setEarnings] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    loadPortfolio();
    loadEarnings();
    loadAnalytics();
  }, [timeRange]);

  const loadPortfolio = async () => {
    try {
      // Mock portfolio data
      setPortfolio([
        {
          id: 1,
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with React and Node.js",
          type: "project",
          image: null,
          technologies: ["React", "Node.js", "MongoDB", "Stripe"],
          completedDate: "2024-01-15",
          client: "Tech Startup Inc",
          status: "completed",
          rating: 4.8,
          views: 1234,
          likes: 89,
          comments: 23,
          featured: true,
        },
        {
          id: 2,
          title: "Data Science Training Program",
          description: "Comprehensive 8-week data science bootcamp curriculum",
          type: "course",
          image: null,
          technologies: ["Python", "Machine Learning", "TensorFlow", "Jupyter"],
          completedDate: "2024-02-01",
          client: "Learning Academy",
          status: "completed",
          rating: 4.9,
          views: 2341,
          likes: 156,
          comments: 45,
          featured: true,
        },
        {
          id: 3,
          title: "Mobile App Design System",
          description: "Complete UI/UX design system for mobile application",
          type: "design",
          image: null,
          technologies: ["Figma", "Sketch", "Adobe XD", "Prototyping"],
          completedDate: "2023-12-10",
          client: "FitTech Solutions",
          status: "completed",
          rating: 4.7,
          views: 892,
          likes: 67,
          comments: 12,
          featured: false,
        },
      ]);
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEarnings = async () => {
    try {
      // Mock earnings data
      setEarnings({
        total: 45678,
        currentMonth: 8934,
        previousMonth: 7234,
        projected: 12500,
        breakdown: {
          projects: 23456,
          courses: 18765,
          consulting: 3457,
        },
        growth: 23.5,
        topClients: [
          { name: "Tech Startup Inc", amount: 12500, projects: 3 },
          { name: "Learning Academy", amount: 8900, projects: 2 },
          { name: "FitTech Solutions", amount: 6700, projects: 1 },
        ],
      });
    } catch (error) {
      console.error("Failed to load earnings:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Mock analytics data
      setAnalytics({
        views: 15678,
        engagement: 78.5,
        conversionRate: 12.3,
        avgProjectValue: 3456,
        completionRate: 94.2,
        clientSatisfaction: 4.8,
        monthlyTrend: [
          { month: "Jan", earnings: 6234, projects: 4 },
          { month: "Feb", earnings: 7234, projects: 5 },
          { month: "Mar", earnings: 8934, projects: 7 },
          { month: "Apr", earnings: 9456, projects: 8 },
        ],
        skillsDemand: [
          { skill: "React", demand: 85, projects: 12 },
          { skill: "Python", demand: 78, projects: 8 },
          { skill: "Data Science", demand: 72, projects: 6 },
          { skill: "UI Design", demand: 65, projects: 4 },
        ],
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio & Earnings</h1>
        <p className="text-gray-600">Showcase your work and track your financial performance</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {["portfolio", "earnings", "analytics", "insights"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "portfolio" && (
          <PortfolioTab portfolio={portfolio} />
        )}
        {activeTab === "earnings" && (
          <EarningsTab earnings={earnings} timeRange={timeRange} setTimeRange={setTimeRange} />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab analytics={analytics} />
        )}
        {activeTab === "insights" && (
          <InsightsTab earnings={earnings} analytics={analytics} />
        )}
      </div>
    </div>
  );
}

function PortfolioTab({ portfolio }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredPortfolio = portfolio.filter(item => 
    filter === "all" || item.type === filter
  ).sort((a, b) => {
    if (sortBy === "recent") return new Date(b.completedDate) - new Date(a.completedDate);
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "views") return b.views - a.views;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="project">Projects</option>
            <option value="course">Courses</option>
            <option value="design">Design</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Work
        </button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPortfolio.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            {item.featured && (
              <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1">
                Featured
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  item.type === "project" ? "bg-blue-100 text-blue-800" :
                  item.type === "course" ? "bg-green-100 text-green-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {item.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
                {item.technologies.length > 3 && (
                  <span className="text-xs text-gray-500">+{item.technologies.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{item.client}</span>
                <span>{item.completedDate}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{item.rating}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {item.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    {item.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {item.comments}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                  View Details
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EarningsTab({ earnings, timeRange, setTimeRange }) {
  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Financial Overview</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.total.toLocaleString()}</p>
              <p className="text-sm text-green-600">+{earnings.growth}%</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.currentMonth.toLocaleString()}</p>
              <p className="text-sm text-green-600">+${earnings.currentMonth - earnings.previousMonth}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projected</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.projected.toLocaleString()}</p>
              <p className="text-sm text-gray-600">End of month</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Project</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.avgProjectValue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Per project</p>
            </div>
            <Briefcase className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Earnings by Category</h4>
          <div className="space-y-3">
            {Object.entries(earnings.breakdown).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize font-medium">{category}</span>
                <span className="font-bold">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Top Clients</h4>
          <div className="space-y-3">
            {earnings.topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.projects} projects</p>
                </div>
                <span className="font-bold">${client.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab({ analytics }) {
  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.engagement}%</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</p>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.clientSatisfaction}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Skills Demand */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold mb-4">Skills in Demand</h4>
        <div className="space-y-3">
          {analytics.skillsDemand.map((skill) => (
            <div key={skill.skill} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.projects} projects</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${skill.demand}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-sm font-medium">{skill.demand}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsTab({ earnings, analytics }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Performance Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Growth Opportunities
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              React development demand increased by 25% this month
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Course completion rate is above industry average
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Client satisfaction score of 4.8 is excellent
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              Top 10% performer in platform earnings
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              95% project completion rate
            </li>
            <li className="flex items-start">
              <span className="text-yellow-500 mr-2">•</span>
              Featured trainer for 3 consecutive months
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold mb-4">Recommendations</h4>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Expand Data Science offerings:</strong> High demand and good earnings potential in this area.
            </p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              <strong>Increase project rates:</strong> Your completion rate justifies a 15-20% rate increase.
            </p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-purple-800">
              <strong>Develop advanced React courses:</strong> Capitalize on the high demand for React skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
