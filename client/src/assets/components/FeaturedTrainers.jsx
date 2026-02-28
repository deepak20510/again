import React from "react";
import { Star, MapPin, ArrowRight } from "lucide-react";

export default function FeaturedTrainers() {
  const trainers = [
    {
      name: "Sarah Jenkins",
      rating: "4.9",
      reviews: 124,
      role: "Senior Leadership Coach",
      location: "New York, NY",
      skills: ["Leadership", "Soft Skills", "Public Speaking"],
    },
    {
      name: "David Chen",
      rating: "5",
      reviews: 89,
      role: "Full Stack Developer & Mentor",
      location: "San Francisco, CA",
      skills: ["React", "Node.js", "System Design"],
    },
    {
      name: "Dr. Emily Al-Fayed",
      rating: "4.8",
      reviews: 215,
      role: "Data Science Instructor",
      location: "London, UK",
      skills: ["Python", "Machine Learning", "Statistics"],
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Trainers</h2>
            <p className="text-gray-600 mt-2">
              Top-rated experts ready to teach.
            </p>
          </div>

          <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition">
            View All <ArrowRight size={18} />
          </button>
        </div>

        {/* Trainer Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md 
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Top Section */}
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-2xl font-semibold text-gray-600">
                  {trainer.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{trainer.name}</h3>

                    <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm">
                      <Star size={14} className="mr-1 fill-yellow-500" />
                      {trainer.rating}
                      <span className="text-gray-500 ml-1">
                        ({trainer.reviews})
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-1">{trainer.role}</p>

                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin size={14} className="mr-1" />
                    {trainer.location}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {trainer.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button className="text-gray-600 text-sm hover:text-blue-600 transition">
                  View Profile
                </button>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  Connect <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
