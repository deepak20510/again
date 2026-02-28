import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  MessageCircle,
  MoreVertical,
  X,
  Send,
} from "lucide-react";

export default function ConnectionsNetwork() {
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadConnections();
    loadSuggestions();
    loadPendingRequests();
  }, []);

  const loadConnections = async () => {
    try {
      // Mock connections data
      setConnections([
        {
          id: 1,
          name: "Sarah Johnson",
          role: "TRAINER",
          headline: "Senior React Developer & Educator",
          location: "San Francisco, CA",
          avatar: null,
          connected: true,
          connectionDate: "2023-06-15",
          mutualConnections: 12,
          skills: ["React", "JavaScript", "Node.js"],
          status: "connected",
        },
        {
          id: 2,
          name: "Tech Academy",
          role: "INSTITUTION",
          headline: "Leading Technology Training Institute",
          location: "New York, NY",
          avatar: null,
          connected: true,
          connectionDate: "2023-08-20",
          mutualConnections: 8,
          skills: ["Web Development", "Data Science", "Cloud Computing"],
          status: "connected",
        },
        {
          id: 3,
          name: "Mike Chen",
          role: "TRAINER",
          headline: "Full Stack Developer & Mentor",
          location: "Austin, TX",
          avatar: null,
          connected: true,
          connectionDate: "2023-09-10",
          mutualConnections: 15,
          skills: ["Python", "Django", "Machine Learning"],
          status: "connected",
        },
      ]);
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    try {
      // Mock suggestions data
      setSuggestions([
        {
          id: 4,
          name: "Emily Davis",
          role: "TRAINER",
          headline: "UX Design Expert & Frontend Developer",
          location: "Seattle, WA",
          avatar: null,
          mutualConnections: 8,
          skills: ["UI Design", "React", "CSS", "Figma"],
          reason: "Worked together at Tech Corp",
          recommendationScore: 95,
        },
        {
          id: 5,
          name: "Learning Hub",
          role: "INSTITUTION",
          headline: "Professional Development Platform",
          location: "Boston, MA",
          avatar: null,
          mutualConnections: 5,
          skills: ["Education", "Online Learning", "Corporate Training"],
          reason: "Similar to Tech Academy",
          recommendationScore: 88,
        },
        {
          id: 6,
          name: "David Kim",
          role: "TRAINER",
          headline: "Data Science & Python Expert",
          location: "Chicago, IL",
          avatar: null,
          mutualConnections: 12,
          skills: ["Python", "Data Analysis", "Machine Learning", "TensorFlow"],
          reason: "3rd degree connection",
          recommendationScore: 82,
        },
      ]);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      // Mock pending requests
      setPendingRequests([
        {
          id: 7,
          name: "Lisa Wang",
          role: "TRAINER",
          headline: "Mobile App Developer",
          location: "Portland, OR",
          avatar: null,
          requestDate: "2024-02-20",
          message: "Hi! I'd love to connect and learn more about your teaching methods.",
          skills: ["React Native", "iOS", "Android"],
        },
        {
          id: 8,
          name: "John Smith",
          role: "TRAINER",
          headline: "DevOps & Cloud Architecture",
          location: "Denver, CO",
          avatar: null,
          requestDate: "2024-02-18",
          message: "Interested in collaborating on cloud training materials.",
          skills: ["AWS", "Docker", "Kubernetes", "DevOps"],
        },
      ]);
    } catch (error) {
      console.error("Failed to load pending requests:", error);
    }
  };

  const handleConnect = async (userId) => {
    try {
      // Mock connection request
      setSuggestions(prev => prev.filter(user => user.id !== userId));
      setPendingRequests(prev => [...prev, suggestions.find(user => user.id === userId)]);
    } catch (error) {
      console.error("Failed to send connection request:", error);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      // Mock accept request
      const user = pendingRequests.find(u => u.id === userId);
      setConnections(prev => [...prev, { ...user, status: "connected" }]);
      setPendingRequests(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      // Mock reject request
      setPendingRequests(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const filteredConnections = connections.filter(conn =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Network</h1>
        <p className="text-gray-600">Grow your professional network with trainers and institutions</p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Connections</p>
              <p className="text-2xl font-bold text-gray-900">{connections.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Suggestions</p>
              <p className="text-2xl font-bold text-gray-900">{suggestions.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex border-b">
          {["connections", "suggestions", "pending", "find"].map((tab) => (
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
              {tab === "pending" && pendingRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "connections" && (
            <ConnectionsTab
              connections={filteredConnections}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSelectedUser={setSelectedUser}
            />
          )}
          {activeTab === "suggestions" && (
            <SuggestionsTab suggestions={suggestions} onConnect={handleConnect} />
          )}
          {activeTab === "pending" && (
            <PendingRequestsTab
              requests={pendingRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          )}
          {activeTab === "find" && <FindPeopleTab />}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

function ConnectionsTab({ connections, searchTerm, setSearchTerm, setSelectedUser }) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedUser(connection)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.headline}</p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {connection.location}
                  </span>
                  <span>•</span>
                  <span>{connection.mutualConnections} mutual connections</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500">Connected</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionsTab({ suggestions, onConnect }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">People You May Know</h3>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                <p className="text-sm text-gray-600">{suggestion.headline}</p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <span>{suggestion.mutualConnections} mutual connections</span>
                  <span>•</span>
                  <span>{suggestion.reason}</span>
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {suggestion.recommendationScore}% match
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onConnect(suggestion.id)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <UserPlus className="w-3 h-3" />
                Connect
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PendingRequestsTab({ requests, onAccept, onReject }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pending Requests</h3>
      <div className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h4 className="font-semibold">{request.name}</h4>
                  <p className="text-sm text-gray-600">{request.headline}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {request.location} • {request.requestDate}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 italic">"{request.message}"</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {request.skills.map((skill) => (
                      <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => onReject(request.id)}
                className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
              >
                Ignore
              </button>
              <button
                onClick={() => onAccept(request.id)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FindPeopleTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    location: "",
    skills: "",
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Find People</h3>
      
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="TRAINER">Trainers</option>
            <option value="INSTITUTION">Institutions</option>
          </select>
          
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="text"
            placeholder="Skills"
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Search Results */}
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Enter search criteria to find people to connect with</p>
      </div>
    </div>
  );
}

function UserDetailsModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">{user.headline}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {user.role}
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Network</h3>
              <p className="text-gray-600">{user.mutualConnections} mutual connections</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
