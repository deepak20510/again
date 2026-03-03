import { useState, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { 
  X, Camera, Upload, User, Briefcase, MapPin, GraduationCap, 
  Building2, Plus, Trash2, Save, Award, Heart, Sparkles
} from "lucide-react";
import ApiService from "../../services/api";

export default function EditProfileModal({ isOpen, onClose, userType, profileData, onSave }) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: profileData.name || "",
    headline: profileData.headline || "",
    location: profileData.location || "",
    about: profileData.about || "",
    skills: profileData.skills || [],
    avatar: profileData.avatar || null,
    coverImage: profileData.coverImage || null,
    experience: profileData.experience || [],
    education: profileData.education || [],
    interests: profileData.interests || [],
    founded: profileData.founded || "",
    website: profileData.website || "",
  });
  
  const [profilePreview, setProfilePreview] = useState(profileData.avatar || null);
  const [coverPreview, setCoverPreview] = useState(profileData.coverImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // State for skills and interests input
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  if (!isOpen) return null;

  const isInstitute = userType === "institute";

  // Filter tabs based on user type
  const tabs = isInstitute 
    ? [
        { id: "basic", label: "Basic Info", icon: User },
        { id: "photos", label: "Photos", icon: Camera },
      ]
    : [
        { id: "basic", label: "Basic Info", icon: User },
        { id: "photos", label: "Photos", icon: Camera },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "skills", label: "Skills", icon: Award },
        { id: "interests", label: "Interests", icon: Heart },
      ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleFileUpload = async (file, type) => {
    try {
      if (type === "profile") setUploadingProfile(true);
      else setUploadingCover(true);

      // Pass file directly - ApiService.uploadFile creates FormData internally
      const response = await ApiService.uploadFile(file);
      
      if (response.success) {
        const imageUrl = response.data.url;
        if (type === "profile") {
          setProfilePreview(imageUrl);
          handleInputChange("avatar", imageUrl);
        } else {
          setCoverPreview(imageUrl);
          handleInputChange("coverImage", imageUrl);
        }
      }
    } catch (err) {
      setError(`Failed to upload ${type} image: ${err.message}`);
      console.error(`${type} upload error:`, err);
    } finally {
      if (type === "profile") setUploadingProfile(false);
      else setUploadingCover(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, type);
    }
  };

  // Experience handlers
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: ""
      }]
    }));
  };

  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: ""
      }]
    }));
  };

  const updateEducation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      let firstName = formData.name;
      let lastName = "";

      if (!isInstitute && formData.name.includes(" ")) {
        const parts = formData.name.split(" ");
        firstName = parts[0];
        lastName = parts.slice(1).join(" ");
      }

      const response = await ApiService.updateGeneralProfile({
        firstName,
        lastName,
        headline: formData.headline,
        location: formData.location,
        bio: formData.about,
        profilePicture: formData.avatar,
        coverImage: formData.coverImage,
        skills: formData.skills,
        experience: formData.experience,
        education: formData.education,
      });

      if (response.success) {
        onSave(response.data);
        onClose();
      } else {
        setError(response.message || "Failed to save profile");
      }
    } catch (error) {
      setError(error.message || "Failed to save profile. Please try again.");
      console.error("Profile save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
          {isInstitute ? "Institute Name" : "Full Name"} *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all`}
          placeholder={isInstitute ? "Institute name" : "Your full name"}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
          Headline *
        </label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) => handleInputChange("headline", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all`}
          placeholder="Professional headline"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-2 flex items-center gap-2`}>
          <MapPin size={16} />
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all`}
          placeholder="City, Country"
        />
      </div>

      {isInstitute && (
        <>
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
              Founded Year
            </label>
            <input
              type="text"
              value={formData.founded}
              onChange={(e) => handleInputChange("founded", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all`}
              placeholder="2020"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
              Website
            </label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all`}
              placeholder="www.example.com"
            />
          </div>
        </>
      )}

      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>
          About
        </label>
        <textarea
          value={formData.about}
          onChange={(e) => handleInputChange("about", e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none transition-all resize-none`}
          placeholder="Tell us about yourself..."
        />
      </div>
    </div>
  );

  const renderPhotos = () => (
    <div className="space-y-6">
      {/* Cover Photo */}
      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-3`}>
          Cover Photo
        </label>
        <div
          className={`relative h-48 rounded-xl overflow-hidden border-2 border-dashed ${theme.cardBorder} ${theme.hoverBg} transition-all cursor-pointer group`}
          onClick={() => !uploadingCover && coverInputRef.current?.click()}
        >
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className={`w-10 h-10 ${theme.textMuted} mb-2`} />
              <span className={`text-sm ${theme.textMuted}`}>Click to upload cover photo</span>
            </div>
          )}
          {uploadingCover && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!uploadingCover && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white w-10 h-10" />
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "cover")}
          className="hidden"
        />
      </div>

      {/* Profile Photo */}
      <div>
        <label className={`block text-sm font-medium ${theme.textSecondary} mb-3`}>
          Profile Photo
        </label>
        <div className="flex items-center gap-6">
          <div
            className="relative cursor-pointer group"
            onClick={() => !uploadingProfile && profileInputRef.current?.click()}
          >
            <div className={`w-32 h-32 rounded-full overflow-hidden border-4 ${theme.cardBorder} shadow-lg`}>
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className={`flex items-center justify-center w-full h-full ${theme.inputBg}`}>
                  <User className={`w-12 h-12 ${theme.textMuted}`} />
                </div>
              )}
            </div>
            {uploadingProfile && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!uploadingProfile && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
            )}
          </div>
          <div>
            <p className={`text-sm ${theme.textSecondary} mb-2`}>
              Upload a professional photo
            </p>
            <p className={`text-xs ${theme.textMuted}`}>
              JPG, PNG or GIF. Max size 5MB
            </p>
          </div>
        </div>
        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "profile")}
          className="hidden"
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {formData.experience.length === 0 ? (
        <div className={`text-center py-8 ${theme.textMuted}`}>
          <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No experience added yet</p>
        </div>
      ) : (
        formData.experience.map((exp, index) => (
          <div key={index} className={`p-4 rounded-xl border ${theme.cardBorder} ${theme.inputBg} space-y-3`}>
            <div className="flex items-start justify-between">
              <h4 className={`font-medium ${theme.textPrimary}`}>Experience {index + 1}</h4>
              <button
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(index, "title", e.target.value)}
                placeholder="Job Title *"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                placeholder="Company *"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
            </div>

            <input
              type="text"
              value={exp.location}
              onChange={(e) => updateExperience(index, "location", e.target.value)}
              placeholder="Location"
              className={`w-full px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                placeholder="Start Date"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                placeholder="End Date"
                disabled={exp.isCurrent}
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm disabled:opacity-50`}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => updateExperience(index, "isCurrent", e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className={`text-sm ${theme.textSecondary}`}>I currently work here</span>
            </label>

            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(index, "description", e.target.value)}
              placeholder="Description"
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm resize-none`}
            />
          </div>
        ))
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme.textPrimary}`}>Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {formData.education.length === 0 ? (
        <div className={`text-center py-8 ${theme.textMuted}`}>
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No education added yet</p>
        </div>
      ) : (
        formData.education.map((edu, index) => (
          <div key={index} className={`p-4 rounded-xl border ${theme.cardBorder} ${theme.inputBg} space-y-3`}>
            <div className="flex items-start justify-between">
              <h4 className={`font-medium ${theme.textPrimary}`}>Education {index + 1}</h4>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <input
              type="text"
              value={edu.school}
              onChange={(e) => updateEducation(index, "school", e.target.value)}
              placeholder="School/University *"
              className={`w-full px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(index, "degree", e.target.value)}
                placeholder="Degree"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
              <input
                type="text"
                value={edu.fieldOfStudy}
                onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                placeholder="Field of Study"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                placeholder="Start Date"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                placeholder="End Date"
                className={`px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm`}
              />
            </div>

            <textarea
              value={edu.description}
              onChange={(e) => updateEducation(index, "description", e.target.value)}
              placeholder="Description"
              rows={2}
              className={`w-full px-3 py-2 rounded-lg border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none text-sm resize-none`}
            />
          </div>
        ))
      )}
    </div>
  );

  const renderSkills = () => {
    const addSkill = () => {
      if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
        handleInputChange("skills", [...formData.skills, newSkill.trim()]);
        setNewSkill("");
      }
    };

    const removeSkill = (skillToRemove) => {
      handleInputChange("skills", formData.skills.filter(s => s !== skillToRemove));
    };

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>Skills</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            placeholder="Add a skill (e.g., JavaScript, React)"
            className={`flex-1 px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none`}
          />
          <button
            onClick={addSkill}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {formData.skills.length === 0 ? (
          <div className={`text-center py-8 ${theme.textMuted}`}>
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No skills added yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${theme.inputBg} border ${theme.cardBorder} group hover:border-red-400 transition-all`}
              >
                <span className={`text-sm ${theme.textPrimary}`}>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderInterests = () => {
    const addInterest = () => {
      if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
        handleInputChange("interests", [...formData.interests, newInterest.trim()]);
        setNewInterest("");
      }
    };

    const removeInterest = (interestToRemove) => {
      handleInputChange("interests", formData.interests.filter(i => i !== interestToRemove));
    };

    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-4`}>Interests</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addInterest()}
            placeholder="Add an interest (e.g., AI, Web Development)"
            className={`flex-1 px-4 py-3 rounded-xl border ${theme.inputBorder} ${theme.inputBg} ${theme.inputText} focus:border-blue-400 focus:outline-none`}
          />
          <button
            onClick={addInterest}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {formData.interests.length === 0 ? (
          <div className={`text-center py-8 ${theme.textMuted}`}>
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No interests added yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 group hover:border-red-400 transition-all`}
              >
                <span className={`text-sm ${theme.textPrimary}`}>{interest}</span>
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border ${theme.cardBorder} ${theme.cardBg}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${theme.divider} ${theme.cardBg}`}>
          <div>
            <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>Edit Profile</h2>
            <p className={`text-sm ${theme.textMuted} mt-1`}>Update your professional information</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${theme.hoverBg} ${theme.hoverText} transition-all`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`sticky top-[89px] z-10 flex gap-2 px-6 py-4 border-b ${theme.divider} ${theme.cardBg} overflow-x-auto`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : `${theme.textSecondary} ${theme.hoverBg}`
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 250px)" }}>
          {activeTab === "basic" && renderBasicInfo()}
          {activeTab === "photos" && renderPhotos()}
          {activeTab === "experience" && renderExperience()}
          {activeTab === "education" && renderEducation()}
          {activeTab === "skills" && renderSkills()}
          {activeTab === "interests" && renderInterests()}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 z-10 flex flex-col gap-3 p-6 border-t ${theme.divider} ${theme.cardBg}`}>
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className={`text-sm ${theme.textMuted}`}>
              * Required fields
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className={`px-6 py-2.5 rounded-xl font-medium ${theme.textSecondary} ${theme.hoverBg} transition-all disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
