import React from "react";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FooterSection() {
  const navigate = useNavigate();
  return (
    <>
      {/* ================= CTA SECTION ================= */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>

          <p className="text-lg text-blue-100 mb-10">
            Join thousands of professionals and students building the future of
            education together.
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold 
            transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              Create Free Account
            </button>

            <button
              className="border border-white px-8 py-3 rounded-lg font-semibold 
            transition-all duration-300 hover:bg-white hover:text-blue-600 hover:-translate-y-1"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-50 py-16 border-t">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Tutroid</h3>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering learning connections. The professional network
              connecting trainers, institutions, and students worldwide.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Platform</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-blue-600 transition cursor-pointer">
                Browse Trainers
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Top Institutions
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Learning Resources
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Success Stories
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Company</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-blue-600 transition cursor-pointer">
                About Us
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Careers
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Blog
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-800">Legal</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-blue-600 transition cursor-pointer">
                Terms of Service
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-blue-600 transition cursor-pointer">
                Cookie Policy
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Tutroid. All rights reserved.
        </div>
      </footer>
    </>
  );
}
