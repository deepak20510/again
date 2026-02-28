import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Calendar,
  User,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
} from "lucide-react";

export default function ReviewRatingSystem() {
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reviews");
  const [filter, setFilter] = useState({
    rating: "all",
    type: "all",
    timeframe: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadReviews();
    loadRatings();
    loadStats();
  }, [filter]);

  const loadReviews = async () => {
    try {
      // Mock reviews data
      setReviews([
        {
          id: 1,
          reviewer: "Sarah Johnson",
          reviewerRole: "TRAINER",
          reviewerAvatar: null,
          rating: 5,
          title: "Excellent React Training!",
          content: "The React training program was comprehensive and well-structured. The instructor was knowledgeable and patient, explaining complex concepts clearly. Hands-on projects were particularly helpful.",
          type: "course",
          subject: "React Development Bootcamp",
          date: "2024-02-15",
          helpful: 23,
          verified: true,
          response: null,
          tags: ["knowledgeable", "patient", "practical"],
        },
        {
          id: 2,
          reviewer: "Mike Chen",
          reviewerRole: "TRAINER",
          reviewerAvatar: null,
          rating: 4,
          title: "Great project collaboration",
          content: "Worked together on an e-commerce project. Good communication and technical skills. Delivered on time and the code quality was excellent. Would work together again.",
          type: "project",
          subject: "E-commerce Platform",
          date: "2024-02-10",
          helpful: 15,
          verified: true,
          response: "Thank you Mike! It was a pleasure working with you too.",
          tags: ["professional", "skilled", "reliable"],
        },
        {
          id: 3,
          reviewer: "Tech Academy",
          reviewerRole: "INSTITUTION",
          reviewerAvatar: null,
          rating: 5,
          title: "Outstanding instructor",
          content: "One of our best instructors. Students consistently rate the courses highly. Great at explaining complex topics and very responsive to student questions.",
          type: "instructor",
          subject: "Web Development Program",
          date: "2024-02-05",
          helpful: 34,
          verified: true,
          response: null,
          tags: ["expert", "engaging", "responsive"],
        },
        {
          id: 4,
          reviewer: "Emily Davis",
          reviewerRole: "TRAINER",
          reviewerAvatar: null,
          rating: 3,
          title: "Good but could be better",
          content: "The course content was good but the pacing could be improved. Some sections felt rushed while others were too slow. More practical examples would help.",
          type: "course",
          subject: "Python Fundamentals",
          date: "2024-01-28",
          helpful: 8,
          verified: false,
          response: "Thanks for the feedback! I'll work on improving the pacing in future sessions.",
          tags: ["content-rich", "pacing-issues"],
        },
      ]);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async () => {
    try {
      // Mock ratings data
      setRatings({
        overall: 4.6,
        breakdown: {
          5: 45,
          4: 28,
          3: 12,
          2: 3,
          1: 2,
        },
        byCategory: {
          courses: 4.7,
          projects: 4.5,
          instructor: 4.8,
          communication: 4.6,
        },
        trends: [
          { month: "Jan", rating: 4.5, reviews: 12 },
          { month: "Feb", rating: 4.6, reviews: 18 },
          { month: "Mar", rating: 4.7, reviews: 25 },
          { month: "Apr", rating: 4.6, reviews: 20 },
        ],
      });
    } catch (error) {
      console.error("Failed to load ratings:", error);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats data
      setStats({
        totalReviews: 90,
        averageRating: 4.6,
        responseRate: 87,
        verifiedReviews: 78,
        improvementAreas: ["Pacing", "More examples", "Advanced topics"],
        strengths: ["Knowledge", "Communication", "Practical approach"],
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const handleHelpful = async (reviewId, isHelpful) => {
    try {
      // Mock helpful vote
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + (isHelpful ? 1 : -1) }
          : review
      ));
    } catch (error) {
      console.error("Failed to vote on review:", error);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filter.rating === "all" || review.rating.toString() === filter.rating;
    const matchesType = filter.type === "all" || review.type === filter.type;
    return matchesSearch && matchesRating && matchesType;
  });

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews & Ratings</h1>
        <p className="text-gray-600">Manage your reputation and client feedback</p>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Rating</p>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">{ratings.overall}</span>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(ratings.overall)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">{stats.totalReviews} reviews</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
              <p className="text-sm text-green-600">Above average</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.verifiedReviews}</p>
              <p className="text-sm text-gray-500">Reviews</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Trend</p>
              <p className="text-2xl font-bold text-gray-900">+0.1</p>
              <p className="text-sm text-green-600">This month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b">
          {["reviews", "analytics", "insights", "manage"].map((tab) => (
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

        <div className="p-6">
          {activeTab === "reviews" && (
            <ReviewsTab
              reviews={filteredReviews}
              filter={filter}
              setFilter={setFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onHelpful={handleHelpful}
            />
          )}
          {activeTab === "analytics" && <AnalyticsTab ratings={ratings} />}
          {activeTab === "insights" && <InsightsTab stats={stats} ratings={ratings} />}
          {activeTab === "manage" && <ManageTab />}
        </div>
      </div>
    </div>
  );
}

function ReviewsTab({ reviews, filter, setFilter, searchTerm, setSearchTerm, onHelpful }) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filter.rating}
            onChange={(e) => setFilter({ ...filter, rating: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="course">Courses</option>
            <option value="project">Projects</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{review.reviewer}</h4>
                    {review.verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm text-gray-500">• {review.reviewerRole}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">• {review.date}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                review.type === "course" ? "bg-blue-100 text-blue-800" :
                review.type === "project" ? "bg-green-100 text-green-800" :
                "bg-purple-100 text-purple-800"
              }`}>
                {review.type}
              </span>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold mb-2">{review.title}</h5>
              <p className="text-gray-700 mb-2">{review.content}</p>
              <p className="text-sm text-gray-500">Subject: {review.subject}</p>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {review.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            {review.response && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Your Response:</strong> {review.response}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{review.helpful} found this helpful</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onHelpful(review.id, true)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    Helpful
                  </button>
                  <button
                    onClick={() => onHelpful(review.id, false)}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    Not Helpful
                  </button>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Respond
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab({ ratings }) {
  const totalReviews = Object.values(ratings.breakdown).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Rating Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Rating Distribution</h4>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <div className="flex items-center w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-current ml-1" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(ratings.breakdown[rating] / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {ratings.breakdown[rating]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Ratings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Category Performance</h4>
          <div className="space-y-3">
            {Object.entries(ratings.byCategory).map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="capitalize">{category}</span>
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rating)
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold mb-4">Monthly Rating Trends</h4>
        <div className="space-y-3">
          {ratings.trends.map((trend) => (
            <div key={trend.month} className="flex items-center justify-between">
              <span>{trend.month}</span>
              <div className="flex items-center space-x-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(trend.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{trend.rating}</span>
                <span className="text-sm text-gray-500">({trend.reviews} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightsTab({ stats, ratings }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Performance Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-green-500" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {stats.strengths.map((strength, index) => (
              <li key={index} className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {stats.improvementAreas.map((area, index) => (
              <li key={index} className="flex items-center text-sm">
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold mb-4">Recommendations</h4>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              <strong>Excellent performance!</strong> Your 4.6 overall rating puts you in the top 15% of trainers.
            </p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Focus on course pacing:</strong> Several reviews mentioned pacing issues. Consider breaking down complex topics.
            </p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="text-sm text-purple-800">
              <strong>Leverage your strengths:</strong> Your knowledge and communication skills are highly rated. Highlight these in your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Management</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Request Reviews</h4>
          <p className="text-sm text-gray-600 mb-4">
            Ask your clients and students to leave reviews to build your reputation.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Send Review Requests
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h4 className="font-semibold mb-4">Review Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Email notifications for new reviews</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" defaultChecked />
              <span className="text-sm">Auto-respond to 5-star reviews</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Display reviews publicly</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-semibold mb-4">Review Templates</h4>
        <div className="space-y-3">
          <div className="border rounded p-3">
            <p className="text-sm font-medium mb-1">Thank You Template</p>
            <p className="text-sm text-gray-600">
              "Thank you for your review! I'm glad you found the training helpful."
            </p>
          </div>
          <div className="border rounded p-3">
            <p className="text-sm font-medium mb-1">Improvement Template</p>
            <p className="text-sm text-gray-600">
              "Thank you for your feedback. I'll work on improving the areas you mentioned."
            </p>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Customize Templates
        </button>
      </div>
    </div>
  );
}
