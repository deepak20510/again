import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, User, Calendar, ThumbsUp, MessageSquare, Filter, TrendingUp, Award } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import ApiService from "../../../services/api";
import LoadingScreen from "../../../components/LoadingScreen";
import ReviewsListModal from "../../../components/ReviewsListModal";

const Reviews = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all"); // all, 5, 4, 3, 2, 1
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when reviews endpoint is available
      // const response = await ApiService.getMyReviews();
      // Mock data for now
      const mockReviews = [
        {
          id: 1,
          reviewer: {
            firstName: "Deepak",
            lastName: "Mahato",
            avatar: "https://i.pravatar.cc/100?img=1",
          },
          rating: 5,
          comment: "Excellent trainer! The JavaScript course was comprehensive and easy to follow. Highly recommended!",
          course: "Complete JavaScript Bootcamp",
          createdAt: "2024-03-01",
          helpful: 12,
        },
        {
          id: 2,
          reviewer: {
            firstName: "Priya",
            lastName: "Sharma",
            avatar: "https://i.pravatar.cc/100?img=2",
          },
          rating: 5,
          comment: "Amazing teaching style. Makes complex React concepts very simple to understand.",
          course: "React JS - The Complete Guide",
          createdAt: "2024-02-28",
          helpful: 8,
        },
        {
          id: 3,
          reviewer: {
            firstName: "Rahul",
            lastName: "Kumar",
            avatar: "https://i.pravatar.cc/100?img=3",
          },
          rating: 4,
          comment: "Great course content. Would love to see more real-world projects.",
          course: "Node.js Backend Development",
          createdAt: "2024-02-25",
          helpful: 5,
        },
        {
          id: 4,
          reviewer: {
            firstName: "Sneha",
            lastName: "Patel",
            avatar: "https://i.pravatar.cc/100?img=4",
          },
          rating: 5,
          comment: "Best investment for my career. Got a job within 2 months of completing the course!",
          course: "Complete JavaScript Bootcamp",
          createdAt: "2024-02-20",
          helpful: 15,
        },
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = filterRating === "all"
    ? reviews
    : reviews.filter(review => review.rating === parseInt(filterRating));

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setShowReviewsModal(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen ${theme.bg} p-6`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>My Reviews</h1>
            <p className={`${theme.textSecondary} mt-1`}>See what students say about your courses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${theme.cardBg} border ${theme.cardBorder}`}>
              <div className={`text-sm ${theme.textMuted}`}>Average Rating</div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className={`text-2xl font-bold ${theme.textPrimary}`}>{averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg ${theme.cardBg} border ${theme.cardBorder}`}>
              <div className={`text-sm ${theme.textMuted}`}>Total Reviews</div>
              <div className={`text-2xl font-bold ${theme.textPrimary}`}>{reviews.length}</div>
            </div>
          </div>
        </div>

        {/* Rating Summary */}
        <div className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 mb-6`}>
          <h2 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-16">
                    <span className={`font-medium ${theme.textPrimary}`}>{rating}</span>
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className={`flex-1 h-2 rounded-full ${theme.hoverBg}`}>
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={`text-sm ${theme.textSecondary} w-12 text-right`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className={`w-5 h-5 ${theme.textMuted}`} />
          <span className={`font-medium ${theme.textPrimary}`}>Filter by rating:</span>
          <div className="flex gap-2">
            {["all", "5", "4", "3", "2", "1"].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  filterRating === rating
                    ? "bg-blue-500 text-white"
                    : `${theme.hoverBg} ${theme.textSecondary} hover:${theme.textPrimary}`
                }`}
              >
                {rating === "all" ? "All" : `${rating} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`${theme.cardBg} rounded-xl border ${theme.cardBorder} p-6 hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => handleReviewClick(review)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.reviewer.avatar}
                  alt={review.reviewer.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${theme.textPrimary}`}>
                        {review.reviewer.firstName} {review.reviewer.lastName}
                      </h3>
                      <p className={`text-sm ${theme.textMuted}`}>
                        Reviewed: {review.course}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : theme.textMuted
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className={`${theme.textSecondary} mb-3`}>{review.comment}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                      <Calendar size={14} />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                      <ThumbsUp size={14} />
                      <span>{review.helpful} found helpful</span>
                    </div>
                    <div className={`flex items-center gap-1 ${theme.textMuted}`}>
                      <MessageSquare size={14} />
                      <span>Reply</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className={`text-center py-12 ${theme.cardBg} rounded-xl`}>
            <Award className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
            <h3 className={`text-xl font-semibold ${theme.textPrimary} mb-2`}>No reviews yet</h3>
            <p className={`${theme.textSecondary}`}>Reviews from your students will appear here</p>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <ReviewsListModal
          isOpen={showReviewsModal}
          onClose={() => {
            setShowReviewsModal(false);
            setSelectedReview(null);
          }}
          reviews={[selectedReview]}
          loading={false}
          averageRating={selectedReview.rating}
          totalReviews={1}
        />
      )}
    </div>
  );
};

export default Reviews;
