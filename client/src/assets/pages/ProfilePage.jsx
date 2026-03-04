import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import EditProfileModal from "../components/EditProfileModal";
import DirectMessageModal from "../../components/DirectMessageModal";
import PostCard from "../components/PostCard";
import ApiService from "../../services/api";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Star,
  Plus,
  Pencil,
  Camera,
  CheckCircle2,
  MoreHorizontal,
  Share2,
  X,
  FileText,
  BookOpen,
} from "lucide-react";
import { DASHBOARD_CONFIG, USER_TYPES } from "../../config/dashboardConfig";

export default function ProfilePage({ userType = USER_TYPES.STUDENT }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { username } = useParams(); // Changed from id to username
  const location = useLocation();
  const { user: authUser, updateProfile } = useAuth();
  const config = DASHBOARD_CONFIG[userType] || DASHBOARD_CONFIG[USER_TYPES.STUDENT];
  const profile = config?.leftSidebar?.profile || { avatar: "", name: "User" };

  // State for edit modal, profiles and posts
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [hireInterestSent, setHireInterestSent] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Create Post Modal State
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trainers and Institutions State
  const [trainers, setTrainers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [showAllTrainers, setShowAllTrainers] = useState(false);
  const [showAllInstitutions, setShowAllInstitutions] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Determine if viewing own profile
  const isOwnProfile = !username || username === authUser?.username;

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserProfile(username); // username can be undefined for own profile
      if (response.success) {
        setProfileData(response.data);
        // Load analytics for this user
        loadAnalytics(response.data.id);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const loadAnalytics = async (userId = null) => {
    try {
      setAnalyticsLoading(true);
      const response = await ApiService.getUserAnalytics(userId);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    fetchTrainers();
    fetchInstitutions();
  }, [loadProfile]);

  const fetchTrainers = async () => {
    try {
      setLoadingTrainers(true);
      const response = await ApiService.searchTrainers({ limit: 10 });
      if (response.success) {
        setTrainers(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch trainers:", error);
    } finally {
      setLoadingTrainers(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      setLoadingInstitutions(true);
      const response = await ApiService.searchInstitutions({ limit: 10 });
      if (response.success) {
        setInstitutions(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch institutions:", error);
    } finally {
      setLoadingInstitutions(false);
    }
  };

  const loadPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      let response;

      if (username) {
        // Load posts for specific user by username
        // First get user ID from username
        const profileResp = await ApiService.getUserProfile(username);
        if (profileResp.success && profileResp.data) {
          response = await ApiService.getPosts({
            authorId: profileResp.data.id,
            page: 1,
            limit: 10,
          });
        }
      } else {
        // Load current user's posts (for own profile)
        response = await ApiService.getMyPosts({ page: 1, limit: 10 });
      }

      if (response && response.success) {
        // Normalize image URLs and profile pictures
        const normalizedPosts = (response.data || []).map((post) => ({
          ...post,
          imageUrl: post.imageUrl
            ? post.imageUrl.startsWith("http")
              ? post.imageUrl
              : `${BACKEND_URL}${post.imageUrl}`
            : null,
          author: post.author
            ? {
                ...post.author,
                // Build name from firstName and lastName, fallback to existing name
                name: post.author.firstName
                  ? `${post.author.firstName} ${post.author.lastName || ""}`.trim()
                  : post.author.name || "User",
                profilePicture: post.author.profilePicture
                  ? post.author.profilePicture.startsWith("http")
                    ? post.author.profilePicture
                    : `${BACKEND_URL}${post.author.profilePicture}`
                  : // Fallback to profile data avatar if viewing same user's posts
                    profileData && post.author.id === profileData.id
                    ? profileData.profilePicture || profileData.avatar
                    : null,
              }
            : {
                // Fallback author object if post.author is null
                id: profileData?.id,
                name: profileData?.firstName
                  ? `${profileData.firstName} ${profileData.lastName || ""}`.trim()
                  : "User",
                profilePicture: profileData?.profilePicture || profileData?.avatar,
                role: profileData?.role,
              },
        }));
        setPosts(normalizedPosts);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setPostsLoading(false);
    }
  }, [username, BACKEND_URL]);

  // Load posts when component mounts, ID changes, or when navigating back to profile
  useEffect(() => {
    if (userType === USER_TYPES.TRAINER || userType === USER_TYPES.INSTITUTE) {
      loadPosts();
    }
  }, [loadPosts, userType, location.key]);

  // Listen for custom event to refresh posts (called from feed after posting)
  useEffect(() => {
    const handleRefreshPosts = () => {
      if (
        userType === USER_TYPES.TRAINER ||
        userType === USER_TYPES.INSTITUTE
      ) {
        loadPosts();
      }
    };

    window.addEventListener("refreshPosts", handleRefreshPosts);
    return () => {
      window.removeEventListener("refreshPosts", handleRefreshPosts);
    };
  }, [loadPosts, userType]);

  // Show success message for 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleEditPost = (post) => {
    console.log("Edit post:", post);
  };

  const handleReviewUpdate = (postId, reviewData) => {
    // Optimistically update the specific post without full refresh
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              averageRating: reviewData.averageRating,
              totalReviews: reviewData.totalReviews,
            }
          : post,
      ),
    );
  };

  const handleHireInterest = async () => {
    if (!profileData?.id) return;
    
    try {
      const response = await ApiService.expressHireInterest(profileData.id);
      if (response.success) {
        setHireInterestSent(true);
        setSaveSuccess(true);
        // Reset success message after 3 seconds
        setTimeout(() => {
          setHireInterestSent(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to send hire interest:", error);
    }
  };

  const handleCopyProfileURL = async () => {
    try {
      const profileUsername = profileData?.username || authUser?.username;
      const userRole = profileData?.role || authUser?.role;
      const rolePath = userRole === 'INSTITUTION' ? 'institute' : userRole?.toLowerCase();
      const profileURL = `${window.location.origin}/${rolePath}/profile/${profileUsername}`;
      
      await navigator.clipboard.writeText(profileURL);
      setUrlCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setUrlCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      const profileUsername = profileData?.username || authUser?.username;
      const userRole = profileData?.role || authUser?.role;
      const rolePath = userRole === 'INSTITUTION' ? 'institute' : userRole?.toLowerCase();
      textArea.value = `${window.location.origin}/${rolePath}/profile/${profileUsername}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    }
  };

  // Profile data mapped from backend fields
  const getMappedData = () => {
    if (!profileData) {
      // Return empty structure while loading
      return {
        name: "",
        headline: "",
        location: "",
        experience: [],
        education: [],
        skills: [],
        analytics: { views: 0, impressions: 0, appearances: 0 },
        activity: { followers: 0, posts: 0 },
      };
    }

    const name = profileData.firstName
      ? `${profileData.firstName} ${profileData.lastName || ""}`.trim()
      : profileData.name || "User";

    const formatDateRange = (start, end, isCurrent) => {
      const startYear = start ? new Date(start).getFullYear() : "N/A";
      const endYear = isCurrent
        ? "Present"
        : end
          ? new Date(end).getFullYear()
          : "N/A";
      return `${startYear} - ${endYear}`;
    };

    const commonData = {
      name,
      headline: profileData.headline || "Member at Tutroid",
      location: profileData.location || "Location not set",
      avatar:
        profileData.profilePicture || profileData.avatar || profile.avatar,
      coverImage: profileData.coverImage || null,
      skills: profileData.trainerProfile?.skills || profileData.skills || [],
      analytics: {
        views: analytics?.overview?.profileViews || profileData.profileViews || 0,
        impressions: analytics?.overview?.postImpressions || profileData.postImpressions || 0,
        appearances: analytics?.overview?.searchAppearances || profileData.searchAppearances || 0,
      },
      activity: {
        followers: profileData.followersCount || 0,
        posts: posts.length,
      },
      education: (profileData.education || []).map((edu) => ({
        school: edu.school,
        degree: edu.degree,
        field: edu.fieldOfStudy,
        years: formatDateRange(edu.startDate, edu.endDate, false),
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(edu.school)}&background=random`,
      })),
      experience: (profileData.experience || []).map((exp) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        years: formatDateRange(exp.startDate, exp.endDate, exp.isCurrent),
        type: "Full-time", // Mock for now
        duration: "Variable",
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.company)}&background=random`,
      })),
      programs: [], // Placeholder for institute programs
    };

    if (userType === USER_TYPES.TRAINER) {
      return {
        ...commonData,
        headline:
          profileData.trainerProfile?.bio ||
          profileData.headline ||
          "Expert Trainer",
        students: profileData.trainerProfile?.completedRequests || 0,
        courses: 0, // Mock for now
        rating: profileData.trainerProfile?.rating || 0,
      };
    }

    if (userType === USER_TYPES.INSTITUTE) {
      return {
        ...commonData,
        headline:
          profileData.institutionProfile?.name ||
          profileData.headline ||
          "Institution",
        founded: "2020", // Mock
        employees: "10-50", // Mock
        trainers: 0,
        students: 0,
        rating: profileData.institutionProfile?.rating || 0,
        programs: [
          {
            name: "Full Stack Development",
            students: 120,
            duration: "6 months",
          },
          { name: "Digital Marketing", students: 85, duration: "3 months" },
        ],
      };
    }

    return commonData;
  };

  const data = getMappedData();

  if (loading) {
    return (
      <div
        className={`${theme.bg} min-h-screen flex items-center justify-center`}
      >
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const isStudent = userType === USER_TYPES.STUDENT;
  const isTrainer = userType === USER_TYPES.TRAINER;
  const isInstitute = userType === USER_TYPES.INSTITUTE;

  // Handler to receive updated profile data from modal
  const handleSaveProfile = (updatedUser) => {
    setProfileData((prev) => ({ ...prev, ...updatedUser }));

    // Dispatch event for sidebar sync
    window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: {
          name: `${updatedUser.firstName} ${updatedUser.lastName || ""}`.trim(),
          headline: updatedUser.headline,
          location: updatedUser.location,
          avatar: updatedUser.profilePicture,
        },
      }),
    );

    if (isOwnProfile && updateProfile) {
      updateProfile(updatedUser);
    }

    setSaveSuccess(true);
  };

  // Create Post Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedImage(file);
      setImagePreview("pdf");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePostSubmit = async () => {
    if (!postText.trim() && !selectedImage) return;
    if (postText.length > 700) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      // Upload image if selected
      if (selectedImage && imagePreview !== "pdf") {
        const uploadResponse = await ApiService.uploadFile(selectedImage, "Post Image");
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data.url;
        }
      } else if (selectedImage && imagePreview === "pdf") {
        const uploadResponse = await ApiService.uploadFile(selectedImage, "Post PDF");
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data.url;
        }
      }

      // Create post
      const response = await ApiService.createPost({
        content: postText.trim(),
        imageUrl: imageUrl,
        type: imagePreview === "pdf" ? "pdf" : selectedImage ? "image" : "text",
      });

      if (response.success) {
        // Reset form
        setPostText("");
        setSelectedImage(null);
        setImagePreview(null);
        setIsCreatePostModalOpen(false);
        
        // Refresh posts
        loadPosts();
        setSaveSuccess(true);
      } else {
        alert(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
    setPostText("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div
      className={`${theme.bg} min-h-screen pb-10 transition-colors duration-300`}
    >
      {/* Header */}
      <header
        className={`${theme.navbarBg} shadow-sm sticky top-0 z-50 transition-colors duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${theme.textSecondary} ${theme.hoverText} transition-colors duration-300`}
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Building2 className={`${theme.accentColor} w-6 h-6`} />
            <span className="font-bold text-xl bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Tutroid
            </span>
          </div>
          <button
            className={`p-2 rounded-lg ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Success Message */}
      {saveSuccess && (
        <div className="max-w-5xl mx-auto mt-4 px-6">
          <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} />
            {hireInterestSent 
              ? "Hire interest sent successfully! The trainer will be notified." 
              : "Profile updated successfully!"}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto mt-6 px-6">
        {/* Profile Card */}
        <div
          className={`${theme.cardBg} rounded-xl shadow-lg overflow-hidden border ${theme.cardBorder} transition-all duration-300`}
        >
          {/* Cover Image */}
          <div
            className={`h-48 relative overflow-hidden bg-linear-to-r from-slate-400 to-slate-500`}
          >
            {data.coverImage && (
              <img
                src={data.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className={`absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-all duration-300`}
              >
                <Camera size={18} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <img
                  src={data.avatar || profile.avatar}
                  alt={data.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg object-cover"
                />
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={`absolute bottom-0 right-0 p-2 rounded-full ${theme.cardBg} ${theme.cardBorder} border shadow-md ${theme.textSecondary} hover:${theme.accentColor} transition-all duration-300`}
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 shadow-md`}
                  >
                    <Pencil size={18} />
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  {/* Show Hire button only when institution views trainer profile */}
                  {isInstitute && profileData?.role === "TRAINER" ? (
                    <button
                      onClick={handleHireInterest}
                      disabled={hireInterestSent}
                      className={`px-4 py-2 rounded-full font-medium ${
                        hireInterestSent 
                          ? "bg-emerald-500 text-white cursor-not-allowed" 
                          : `${theme.accentBg} text-white hover:opacity-90`
                      } transition-all duration-300`}
                    >
                      {hireInterestSent ? "Interest Sent ✓" : "Hire"}
                    </button>
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-full font-medium ${theme.accentBg} text-white hover:opacity-90 transition-all duration-300`}
                    >
                      {isInstitute ? "Follow" : "Connect"}
                    </button>
                  )}
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className={`px-4 py-2 rounded-full font-medium border ${theme.cardBorder} ${theme.textPrimary} ${theme.hoverBg} transition-all duration-300`}
                  >
                    Message
                  </button>
                </>
              )}
            </div>

            {/* Info */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
                  {data.name}
                </h1>
                <CheckCircle2 className={`${theme.accentColor} w-6 h-6`} />
                {isStudent && (
                  <span className={`${theme.textMuted} text-sm`}>(He/Him)</span>
                )}
              </div>
              <p className={`${theme.textSecondary} mt-1 leading-relaxed`}>
                {data.headline}
              </p>

              <div
                className={`flex items-center gap-4 mt-3 text-sm ${theme.textMuted}`}
              >
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {data.location}
                </span>
                {isInstitute && (
                  <>
                    <span>•</span>
                    <span>{data.founded} Founded</span>
                    <span>•</span>
                    <span>{data.employees} employees</span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div
                className={`flex items-center gap-4 mt-3 text-sm ${theme.accentColor} font-medium`}
              >
                {isStudent && (
                  <>
                    <span>{data.connections} connections</span>
                  </>
                )}
                {isTrainer && (
                  <>
                    <span>{data.students} students trained</span>
                    <span>•</span>
                    <span>{data.courses} courses</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-current" />
                      {data.rating} rating
                    </span>
                  </>
                )}
                {isInstitute && (
                  <>
                    <span>{data.trainers} trainers</span>
                    <span>•</span>
                    <span>{data.students} students</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star size={14} className="fill-current" />
                      {data.rating} rating
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Analytics */}
            <div
              className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                  Analytics
                </h2>
                <span className={`text-sm ${theme.textMuted}`}>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Private to you
                  </span>
                </span>
              </div>

              {analyticsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-3 rounded-lg ${theme.hoverBg} transition-all duration-300`}
                    >
                      <div className={`text-xl font-bold ${theme.textPrimary}`}>
                        {analytics?.overview?.profileViews || 0}
                      </div>
                      <div className={`text-sm ${theme.textMuted}`}>
                        Profile views
                      </div>
                      <div className={`text-xs ${theme.textMuted} mt-1`}>
                        Past 7 days
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${theme.hoverBg} transition-all duration-300`}
                    >
                      <div className={`text-xl font-bold ${theme.textPrimary}`}>
                        {analytics?.overview?.postImpressions || 0}
                      </div>
                      <div className={`text-sm ${theme.textMuted}`}>
                        Post impressions
                      </div>
                      <div className={`text-xs ${theme.textMuted} mt-1`}>
                        Past 7 days
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${theme.hoverBg} transition-all duration-300`}
                    >
                      <div className={`text-xl font-bold ${theme.textPrimary}`}>
                        {analytics?.overview?.searchAppearances || 0}
                      </div>
                      <div className={`text-sm ${theme.textMuted}`}>
                        Search appearances
                      </div>
                      <div className={`text-xs ${theme.textMuted} mt-1`}>
                        Past 7 days
                      </div>
                    </div>
                  </div>

                  {/* Additional Analytics Details */}
                  {analytics && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`text-sm ${theme.textMuted}`}>
                          <span className="font-medium">Connections:</span>{" "}
                          <span className={theme.textPrimary}>
                            {analytics.engagement?.connections || 0}
                          </span>
                        </div>
                        <div className={`text-sm ${theme.textMuted}`}>
                          <span className="font-medium">Total Posts:</span>{" "}
                          <span className={theme.textPrimary}>
                            {analytics.content?.totalPosts || 0}
                          </span>
                        </div>
                        <div className={`text-sm ${theme.textMuted}`}>
                          <span className="font-medium">Average Rating:</span>{" "}
                          <span className={theme.textPrimary}>
                            {analytics.content?.averageRating?.toFixed(1) || "0.0"} ⭐
                          </span>
                        </div>
                        <div className={`text-sm ${theme.textMuted}`}>
                          <span className="font-medium">Growth:</span>{" "}
                          <span className={`${analytics.overview?.growthPercentage >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {analytics.overview?.growthPercentage >= 0 ? '+' : ''}{analytics.overview?.growthPercentage || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      console.log("Full analytics:", analytics);
                      alert("Detailed analytics view coming soon!");
                    }}
                    className={`mt-4 text-sm ${theme.accentColor} font-medium hover:underline`}
                  >
                    Show all analytics →
                  </button>
                </>
              )}
            </div>

            {/* Posts - Only for Trainer & Institute */}
            {(isTrainer || isInstitute) && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                    Posts
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`${theme.accentColor} font-medium`}>
                      {posts.length} posts
                    </span>
                    {isOwnProfile && ( // Show Create Post button only on own profile
                      <button
                        onClick={() => setIsCreatePostModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        <Plus size={16} />
                        Create Post
                      </button>
                    )}
                  </div>
                </div>

                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
                  </div>
                ) : posts.length === 0 ? (
                  <div
                    className={`${theme.textMuted} text-sm text-center py-8`}
                  >
                    <p>No posts yet</p>
                    <p className="mt-1">Posts shared will be displayed here.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {(showAllPosts ? posts : posts.slice(0, 1)).map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          user={{ id: profileData?.id || authUser?.id }} // Pass the user ID
                          isLiked={false}
                          isSaved={false}
                          showComments={false}
                          commentInput=""
                          onLike={() => console.log("Like post:", post.id)}
                          onSave={() => console.log("Save post:", post.id)}
                          onShare={() => console.log("Share post:", post.id)}
                          onComment={() =>
                            console.log("Comment on post:", post.id)
                          }
                          onSubmitComment={() => console.log("Submit comment")}
                          onToggleComments={() => console.log("Toggle comments")}
                          onDelete={handleDeletePost}
                          onEdit={handleEditPost}
                          isOwnProfile={isOwnProfile} // True if viewing own profile, false if viewing other trainer's profile
                          onReviewUpdate={handleReviewUpdate}
                        />
                      ))}
                    </div>
                    
                    {/* Show all posts button */}
                    {posts.length > 1 && (
                      <button
                        onClick={() => setShowAllPosts(!showAllPosts)}
                        className={`w-full mt-4 py-3 rounded-lg font-medium text-sm ${theme.textSecondary} ${theme.hoverBg} ${theme.hoverText} transition-all duration-300 flex items-center justify-center gap-2`}
                      >
                        {showAllPosts ? (
                          <>
                            Show less
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Show all {posts.length} posts
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Experience - Only for Trainer */}
            {isTrainer && (data.experience || []).length > 0 && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                    Experience
                  </h2>
                  <button
                    className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.experience || []).map((exp, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className={`font-semibold ${theme.textPrimary}`}>
                          {exp.title}
                        </h3>
                        <p className={`text-sm ${theme.textSecondary}`}>
                          {exp.company}
                        </p>
                        <p className={`text-sm ${theme.textMuted}`}>
                          {exp.years}
                        </p>
                        <p className={`text-xs ${theme.textMuted}`}>
                          {exp.type} • {exp.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isInstitute && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                    Training Programs
                  </h2>
                  <button
                    className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {(data.programs || []).map((prog, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${theme.hoverBg} transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${theme.textPrimary}`}>
                          {prog.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500`}
                        >
                          Active
                        </span>
                      </div>
                      <p className={`text-sm ${theme.textMuted} mt-1`}>
                        {prog.students} students enrolled • {prog.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education - Only for Student & Trainer */}
            {!isInstitute && (data.education || []).length > 0 && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                    Education
                  </h2>
                  <div className="flex gap-2">
                    <button
                      className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
                    >
                      <Plus size={20} />
                    </button>
                    <button
                      className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {(data.education || []).map((edu, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={edu.logo}
                        alt={edu.school}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className={`font-semibold ${theme.textPrimary}`}>
                          {edu.school}
                        </h3>
                        <p className={`text-sm ${theme.textSecondary}`}>
                          {edu.degree}
                        </p>
                        <p className={`text-sm ${theme.textMuted}`}>
                          {edu.years}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills - Only for Trainer */}
            {isTrainer && (data.skills || []).length > 0 && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>
                    Skills
                  </h2>
                  <button
                    className={`px-3 py-1.5 rounded-full border ${theme.cardBorder} ${theme.accentColor} font-medium text-sm hover:${theme.hoverBg} transition-all duration-300`}
                  >
                    Add skills
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(data.skills || []).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        isStudent
                          ? "bg-blue-500/10 text-blue-500"
                          : isTrainer
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-purple-500/10 text-purple-500"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests - Only for Trainer */}
            {isTrainer && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <h2 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>
                  Interests
                </h2>
                <div className="flex gap-3">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium bg-emerald-600 text-white`}
                  >
                    {isStudent
                      ? "Top Voices"
                      : isTrainer
                        ? "Companies"
                        : "Students"}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${theme.cardBorder} ${theme.textSecondary} ${theme.hoverBg} transition-all duration-300`}
                  >
                    Companies
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${theme.cardBorder} ${theme.textSecondary} ${theme.hoverBg} transition-all duration-300`}
                  >
                    Groups
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Quick Actions - Only for Trainer (own profile) */}
            {isTrainer && isOwnProfile && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <h3 className={`font-semibold ${theme.textPrimary} mb-4`}>
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/trainer/courses")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${theme.hoverBg} ${theme.textPrimary} hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 font-medium`}
                  >
                    <BookOpen size={18} />
                    My Courses
                  </button>
                  <button
                    onClick={() => navigate("/trainer/reviews")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${theme.hoverBg} ${theme.textPrimary} hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 font-medium`}
                  >
                    <Star size={18} />
                    Reviews
                  </button>
                </div>
              </div>
            )}

            {/* Trainers you may know - Only show for TRAINER and STUDENT */}
            {(isTrainer || isStudent) && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <h3 className={`font-semibold ${theme.textPrimary} mb-4`}>
                  Trainers you may know
                </h3>

                {loadingTrainers ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-b-2 border-blue-500 rounded-full" />
                  </div>
                ) : trainers.length === 0 ? (
                  <p className={`text-sm ${theme.textMuted} text-center py-4`}>
                    No trainers found
                  </p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {(showAllTrainers ? trainers : trainers.slice(0, 3)).map((trainer) => (
                        <div key={trainer.id} className="flex items-start gap-3">
                          <img
                            src={trainer.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.user?.firstName || "T")}&background=random`}
                            alt={trainer.user?.firstName || "Trainer"}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4
                              className={`font-medium text-sm ${theme.textPrimary}`}
                            >
                              {trainer.user?.firstName
                                ? `${trainer.user.firstName} ${trainer.user.lastName || ""}`.trim()
                                : "Trainer"}
                            </h4>
                            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                              {trainer.bio || trainer.skills?.slice(0, 3).join(", ") || "Expert Trainer"}
                            </p>
                            <button
                              onClick={() => navigate(`/trainer/profile/${trainer.user?.username || trainer.user?.id}`)}
                              className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium border ${theme.cardBorder} ${theme.accentColor} hover:${theme.hoverBg} transition-all duration-300`}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {trainers.length > 3 && (
                      <button
                        onClick={() => setShowAllTrainers(!showAllTrainers)}
                        className={`mt-4 text-sm ${theme.textMuted} hover:${theme.textPrimary} transition-colors duration-300 flex items-center gap-1`}
                      >
                        {showAllTrainers ? "Show less" : `Show all ${trainers.length} trainers`} →
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Institutes hiring now - Show for TRAINER and STUDENT */}
            {(isTrainer || isStudent) && (
              <div
                className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
              >
                <h3 className={`font-semibold ${theme.textPrimary} mb-4`}>
                  Institutes hiring now
                </h3>

                {loadingInstitutions ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-b-2 border-blue-500 rounded-full" />
                  </div>
                ) : institutions.length === 0 ? (
                  <p className={`text-sm ${theme.textMuted} text-center py-4`}>
                    No institutions found
                  </p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {(showAllInstitutions ? institutions : institutions.slice(0, 3)).map((institution) => (
                        <div key={institution.id} className="flex items-start gap-3">
                          <img
                            src={institution.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(institution.name || "I")}&background=random`}
                            alt={institution.name || "Institution"}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4
                              className={`font-medium text-sm ${theme.textPrimary}`}
                            >
                              {institution.name || "Institution"}
                            </h4>
                            <p className={`text-xs ${theme.textMuted} mt-0.5`}>
                              {institution.location || "Location not set"}
                              {institution._count?.requests > 0 && ` • ${institution._count.requests} hiring`}
                            </p>
                            <button
                              onClick={() => navigate(`/institute/profile/${institution.user?.username || institution.user?.id}`)}
                              className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium border ${theme.cardBorder} ${theme.accentColor} hover:${theme.hoverBg} transition-all duration-300`}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {institutions.length > 3 && (
                      <button
                        onClick={() => setShowAllInstitutions(!showAllInstitutions)}
                        className={`mt-4 text-sm ${theme.textMuted} hover:${theme.textPrimary} transition-colors duration-300 flex items-center gap-1`}
                      >
                        {showAllInstitutions ? "Show less" : `Show all ${institutions.length} institutes`} →
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Profile language */}
            <div
              className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${theme.textPrimary}`}>
                    Profile language
                  </h3>
                  <p className={`text-sm ${theme.textMuted} mt-1`}>English</p>
                </div>
                <button
                  className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all duration-300`}
                >
                  <Pencil size={18} />
                </button>
              </div>
            </div>

            {/* Public profile & URL */}
            <div
              className={`${theme.cardBg} rounded-xl shadow-lg p-5 border ${theme.cardBorder} transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${theme.textPrimary}`}>
                    Public profile & URL
                  </h3>
                  <p
                    className={`text-sm ${theme.textMuted} mt-1 truncate max-w-45`}
                  >
                    {window.location.origin}/{data.role === 'INSTITUTION' ? 'institute' : data.role?.toLowerCase()}/profile/{data.username || data.name.toLowerCase().replace(/\s+/g, "-")}
                  </p>
                </div>
                <button
                  onClick={handleCopyProfileURL}
                  className={`p-2 rounded-full ${urlCopied ? 'bg-green-500 text-white' : `${theme.hoverBg} ${theme.hoverText}`} transition-all duration-300 relative group`}
                  title={urlCopied ? "Copied!" : "Copy profile URL"}
                >
                  {urlCopied ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Share2 size={18} />
                  )}
                  {urlCopied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userType={userType}
        profileData={data}
        onSave={handleSaveProfile}
      />

      {/* Direct Message Modal */}
      <DirectMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipient={profileData}
      />

      {/* Create Post Modal */}
      {isCreatePostModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 z-50 px-4">
          <div className={`${theme.cardBg} w-full max-w-xl rounded-2xl shadow-2xl border ${theme.cardBorder} overflow-hidden`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center px-5 py-4 border-b ${theme.cardBorder}`}>
              <h3 className={`font-bold text-lg ${theme.textPrimary}`}>Create Post</h3>
              <button
                onClick={closeCreatePostModal}
                className={`p-2 rounded-full ${theme.hoverBg} ${theme.textMuted} hover:${theme.textPrimary} transition-colors`}
              >
                <X size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 px-5 py-3">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                  {(authUser?.firstName || authUser?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className={`font-semibold text-sm ${theme.textPrimary}`}>
                  {authUser?.firstName || authUser?.name || "Anonymous User"}
                </div>
                <div className={`text-xs ${theme.textMuted}`}>Post to anyone • Public</div>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-5 pb-3">
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows="4"
                className={`w-full border-none outline-none resize-none text-base ${theme.textPrimary} bg-transparent placeholder:${theme.textMuted}`}
                placeholder="What do you want to talk about?"
              />

              {/* Image / PDF Preview */}
              {imagePreview && (
                <div className="mt-3 relative">
                  {imagePreview === "pdf" && selectedImage ? (
                    <div className={`flex items-center gap-3 p-4 ${theme.hoverBg} rounded-xl border ${theme.cardBorder}`}>
                      <FileText className="w-10 h-10 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${theme.textPrimary} truncate`}>
                          {selectedImage.name}
                        </p>
                        <p className={`text-xs ${theme.textMuted}`}>PDF document</p>
                      </div>
                      <button onClick={removeImage} className={`${theme.textMuted} hover:text-red-500 p-1`}>
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full rounded-xl max-h-64 object-cover"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Media Options */}
            <div className={`px-5 py-3 border-t ${theme.cardBorder}`}>
              <div className="flex items-center gap-2">
                <label className={`flex items-center gap-2 text-xs font-medium ${theme.textSecondary} hover:text-blue-500 cursor-pointer transition-colors px-3 py-2 rounded-lg ${theme.hoverBg}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photo
                </label>

                <label className={`flex items-center gap-2 text-xs font-medium ${theme.textSecondary} hover:text-blue-500 cursor-pointer transition-colors px-3 py-2 rounded-lg ${theme.hoverBg}`}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <FileText className="w-4 h-4 text-red-500" />
                  PDF
                </label>
              </div>
            </div>

            {/* Post Button */}
            <div className={`flex justify-between items-center px-5 py-3 border-t ${theme.cardBorder}`}>
              <span className={`text-xs ${postText.length > 650 ? "text-red-500" : theme.textMuted}`}>
                {postText.length}/700
              </span>
              <button
                disabled={(!postText.trim() && !selectedImage) || postText.length > 700 || isSubmitting}
                onClick={handlePostSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:bg-blue-400/50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Posting...
                  </span>
                ) : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
