import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderSection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* ================= NAVBAR (Kept as is per request) ================= */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg text-sm sm:text-base">🎓</div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Tutroid</h1>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-gray-600 font-medium text-sm lg:text-base">
            {["Find Trainers", "Institutions", "Courses"].map((item) => (
              <a key={item} href="#" className="relative group cursor-pointer">
                <span className="hover:text-blue-600 transition-colors duration-300">
                  {item}
                </span>

                {/* Animated underline */}
                <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/login")}
              className="relative font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full text-sm sm:text-base"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION (New Professional Design) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Content */}
        <div>
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            NEW: CORPORATE TRAINING PARTNERSHIPS
          </span>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 text-gray-900">
            The bridge between{" "}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              expert minds
            </span>{" "}
            and eager students.
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-lg leading-relaxed">
            The world&apos;s leading marketplace for professional training.
            Whether you&apos;re an independent trainer, a global institution, or
            a student seeking mastery, we connect you to excellence.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
            <button className="bg-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base">
              Become a Trainer
              <ArrowRight size={18} />
            </button>

            <button className="bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 text-sm sm:text-base">
              Find a Course
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-xs sm:text-sm font-medium">
              Trusted by{" "}
              <span className="text-gray-900 font-bold">12,000+</span> certified
              experts
            </span>
          </div>
        </div>

        {/* Right - Dashboard Mockup */}
        <div className="relative hidden md:block">
          {/* Main Dashboard Container */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Window Header */}
            <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-red-400"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-amber-400"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium ml-auto tracking-wider">
                MARKETPLACE DASHBOARD
              </span>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Search Bar Mock */}
              <div className="bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                <span className="text-gray-400 text-xs sm:text-sm">
                  Search skills, trainers...
                </span>
              </div>

              {/* Dashboard Cards */}
              <div className="space-y-2 sm:space-y-3">
                <div className="border border-gray-100 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <div className="w-4 h-4 rounded bg-indigo-500"></div>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base">
                      Platform Dashboard
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="border border-gray-100 rounded-xl p-2 sm:p-3">
                    <div className="text-[10px] sm:text-xs text-gray-400 mb-1">
                      Active Courses
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">
                      2,450+
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-2 sm:p-3">
                    <div className="text-[10px] sm:text-xs text-gray-400 mb-1">
                      Expert Trainers
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-800">850+</div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-3 sm:p-4">
                  <div className="text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
                    Course Categories
                  </div>
                  <div className="space-y-2">
                    {[
                      "Web Development",
                      "Data Science",
                      "Cloud Computing",
                      "AI/ML",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3">
                        <div className="w-4 h-4 rounded border-2 border-gray-200"></div>
                        <span className="text-xs sm:text-sm text-gray-600">{item}</span>
                        <div className="ml-auto w-12 sm:w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-400 rounded-full"
                            style={{ width: `${85 - i * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-800">
                  New Join
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-400">Just now</div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="w-3 sm:w-4 h-3 sm:h-4 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-800">
                  Top Rated
                </div>
                <div className="text-[8px] sm:text-[10px] text-gray-400">4.9/5.0</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
