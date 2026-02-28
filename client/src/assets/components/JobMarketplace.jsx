import { useState, useEffect } from "react";
import ApiService from "../../services/api";
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Bookmark,
  ExternalLink,
} from "lucide-react";

export default function JobMarketplace() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    budget: "all",
    duration: "all",
    level: "all",
  });
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      // Mock jobs data - replace with actual API call
      setJobs([
        {
          id: 1,
          title: "React Developer Needed for E-commerce Project",
          description: "Looking for an experienced React developer to build a modern e-commerce platform with payment integration.",
          category: "Web Development",
          budget: "$5000 - $8000",
          duration: "2-3 months",
          level: "Intermediate",
          skills: ["React", "Node.js", "MongoDB", "Stripe API"],
          client: {
            name: "Tech Startup Inc",
            rating: 4.8,
            jobsPosted: 15,
            memberSince: "2022",
          },
          proposals: 12,
          deadline: "2024-04-15",
          status: "open",
          featured: true,
        },
        {
          id: 2,
          title: "Python Data Science Tutor",
          description: "Need an experienced Python tutor for data science concepts including pandas, numpy, and machine learning basics.",
          category: "Education & Training",
          budget: "$30 - $50 per hour",
          duration: "Ongoing",
          level: "Beginner",
          skills: ["Python", "Data Science", "Machine Learning", "Teaching"],
          client: {
            name: "Learning Academy",
            rating: 4.9,
            jobsPosted: 8,
            memberSince: "2021",
          },
          proposals: 8,
          deadline: "Flexible",
          status: "open",
          featured: false,
        },
        {
          id: 3,
          title: "UI/UX Designer for Mobile App",
          description: "Design a modern and intuitive mobile app interface for fitness tracking application.",
          category: "Design",
          budget: "$3000 - $5000",
          duration: "1-2 months",
          level: "Advanced",
          skills: ["UI Design", "UX Research", "Figma", "Mobile Design"],
          client: {
            name: "FitTech Solutions",
            rating: 4.7,
            jobsPosted: 23,
            memberSince: "2020",
          },
          proposals: 18,
          deadline: "2024-03-30",
          status: "open",
          featured: true,
        },
      ]);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         job.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === "all" || job.category === filters.category;
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Marketplace</h1>
        <p className="text-gray-600">Find the perfect opportunities for your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Design">Design</option>
            <option value="Education & Training">Education & Training</option>
          </select>
          <select
            value={filters.budget}
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Budgets</option>
            <option value="under-500">Under $500</option>
            <option value="500-2000">$500 - $2000</option>
            <option value="2000-5000">$2000 - $5000</option>
            <option value="5000+">$5000+</option>
          </select>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.featured).length}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {job.featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    {job.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.budget}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {job.proposals} proposals
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.deadline}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Client Info */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{job.client.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {job.client.rating}
                      </span>
                      <span>•</span>
                      <span>{job.client.jobsPosted} jobs posted</span>
                    </div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedJob.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Budget</h3>
                    <p className="text-gray-600">{selectedJob.budget}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Duration</h3>
                    <p className="text-gray-600">{selectedJob.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Level</h3>
                    <p className="text-gray-600">{selectedJob.level}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Deadline</h3>
                    <p className="text-gray-600">{selectedJob.deadline}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">About the Client</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">{selectedJob.client.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          {selectedJob.client.rating} rating
                        </span>
                        <span>•</span>
                        <span>{selectedJob.client.jobsPosted} jobs posted</span>
                        <span>•</span>
                        <span>Member since {selectedJob.client.memberSince}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
