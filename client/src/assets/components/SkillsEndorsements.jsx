import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import {
  Star,
  Plus,
  Users,
  TrendingUp,
  Award,
  Search,
  Filter,
  CheckCircle,
  User,
  ThumbsUp,
} from "lucide-react";

export default function SkillsEndorsements() {
  const [skills, setSkills] = useState([]);
  const [endorsements, setEndorsements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-skills");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadSkills();
    loadEndorsements();
  }, []);

  const loadSkills = async () => {
    try {
      // Mock skills data
      setSkills([
        {
          id: 1,
          name: "JavaScript",
          category: "Programming",
          level: "Expert",
          endorsements: 45,
          endorsedBy: ["Sarah Johnson", "Mike Chen", "Emily Davis"],
          verified: true,
          yearsExperience: 5,
        },
        {
          id: 2,
          name: "React",
          category: "Programming",
          level: "Advanced",
          endorsements: 38,
          endorsedBy: ["John Smith", "Lisa Wang", "David Kim"],
          verified: true,
          yearsExperience: 4,
        },
        {
          id: 3,
          name: "Node.js",
          category: "Programming",
          level: "Advanced",
          endorsements: 32,
          endorsedBy: ["Alex Rodriguez", "Rachel Green", "Tom Wilson"],
          verified: false,
          yearsExperience: 3,
        },
        {
          id: 4,
          name: "Data Science",
          category: "Data",
          level: "Intermediate",
          endorsements: 28,
          endorsedBy: ["Jennifer Lee", "Mark Brown", "Sophie Turner"],
          verified: false,
          yearsExperience: 2,
        },
        {
          id: 5,
          name: "Machine Learning",
          category: "Data",
          level: "Intermediate",
          endorsements: 22,
          endorsedBy: ["Chris Evans", "Natasha Romanoff", "Bruce Banner"],
          verified: false,
          yearsExperience: 2,
        },
        {
          id: 6,
          name: "Teaching",
          category: "Soft Skills",
          level: "Expert",
          endorsements: 56,
          endorsedBy: ["Tony Stark", "Steve Rogers", "Thor Odinson"],
          verified: true,
          yearsExperience: 6,
        },
      ]);
    } catch (error) {
      console.error("Failed to load skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEndorsements = async () => {
    try {
      // Mock endorsements data
      setEndorsements([
        {
          id: 1,
          skill: "JavaScript",
          endorser: "Sarah Johnson",
          endorserRole: "TRAINER",
          endorserAvatar: null,
          date: "2024-02-15",
          comment: "Excellent JavaScript skills! Great problem solver.",
          rating: 5,
        },
        {
          id: 2,
          skill: "React",
          endorser: "Mike Chen",
          endorserRole: "TRAINER",
          endorserAvatar: null,
          date: "2024-02-10",
          comment: "Amazing React developer. Clean code and great architecture.",
          rating: 5,
        },
      ]);
    } catch (error) {
      console.error("Failed to load endorsements:", error);
    }
  };

  const handleEndorse = async (skillId) => {
    try {
      // Mock endorsement
      setSkills(prev => prev.map(skill => 
        skill.id === skillId 
          ? { 
              ...skill, 
              endorsements: skill.endorsements + 1,
              endorsedBy: [...skill.endorsedBy, "Current User"]
            }
          : skill
      ));
    } catch (error) {
      console.error("Failed to endorse skill:", error);
    }
  };

  const categories = ["all", ...new Set(skills.map(skill => skill.category))];
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skills & Endorsements</h1>
        <p className="text-gray-600">Showcase your expertise and get endorsed by your network</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Skills</p>
              <p className="text-2xl font-bold text-gray-900">{skills.length}</p>
            </div>
            <Award className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Endorsements</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.reduce((sum, skill) => sum + skill.endorsements, 0)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Verified Skills</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(skill => skill.verified).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expert Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {skills.filter(skill => skill.level === "Expert").length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b">
          {["my-skills", "endorsements", "trending", "add-skill"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "my-skills" && (
            <MySkillsTab
              skills={filteredSkills}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onEndorse={handleEndorse}
            />
          )}
          {activeTab === "endorsements" && <EndorsementsTab endorsements={endorsements} />}
          {activeTab === "trending" && <TrendingSkillsTab />}
          {activeTab === "add-skill" && <AddSkillTab />}
        </div>
      </div>
    </div>
  );
}

function MySkillsTab({ skills, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, onEndorse }) {
  const getLevelColor = (level) => {
    switch (level) {
      case "Expert": return "bg-purple-100 text-purple-800";
      case "Advanced": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-green-100 text-green-800";
      case "Beginner": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                  {skill.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                  <span className="text-sm text-gray-500">{skill.category}</span>
                  <span className="text-sm text-gray-500">• {skill.yearsExperience} years</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Proficiency</span>
                <span className="text-sm font-medium">{skill.endorsements} endorsements</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min((skill.endorsements / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Endorsed by:</p>
              <div className="flex flex-wrap gap-1">
                {skill.endorsedBy.slice(0, 3).map((endorser, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {endorser}
                  </span>
                ))}
                {skill.endorsedBy.length > 3 && (
                  <span className="text-xs text-gray-500">+{skill.endorsedBy.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.min(skill.endorsements / 10, 5)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => onEndorse(skill.id)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <ThumbsUp className="w-3 h-3" />
                Endorse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndorsementsTab({ endorsements }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Recent Endorsements</h3>
      {endorsements.map((endorsement) => (
        <div key={endorsement.id} className="border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{endorsement.endorser}</h4>
                  <p className="text-sm text-gray-500">{endorsement.endorserRole} • {endorsement.date}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < endorsement.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                  {endorsement.skill}
                </span>
              </div>
              <p className="text-gray-700">{endorsement.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendingSkillsTab() {
  const trendingSkills = [
    { name: "React", growth: "+25%", demand: "High" },
    { name: "Python", growth: "+18%", demand: "High" },
    { name: "Machine Learning", growth: "+32%", demand: "Very High" },
    { name: "Data Science", growth: "+28%", demand: "High" },
    { name: "Cloud Computing", growth: "+22%", demand: "High" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Trending Skills This Month</h3>
      <div className="space-y-3">
        {trendingSkills.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold">{skill.name}</h4>
                <p className="text-sm text-gray-500">Demand: {skill.demand}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">{skill.growth}</span>
              <TrendingUp className="w-4 h-4 text-green-600 inline ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddSkillTab() {
  const [newSkill, setNewSkill] = useState({
    name: "",
    category: "",
    level: "Beginner",
    yearsExperience: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle skill submission
    console.log("Adding skill:", newSkill);
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., JavaScript, Project Management"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Data">Data</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            value={newSkill.yearsExperience}
            onChange={(e) => setNewSkill({ ...newSkill, yearsExperience: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Number of years"
            min="0"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Skill
          </button>
        </div>
      </form>
    </div>
  );
}
