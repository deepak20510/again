import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";

export default function LoadingScreen({ message = "Loading..." }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
          </div>
          
          {/* Inner pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-cyan-200 dark:border-cyan-900 rounded-full animate-pulse"></div>
          </div>
          
          {/* Logo */}
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-4 rounded-2xl shadow-lg animate-bounce">
              <Building2 size={32} />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 animate-pulse">
          Tutroid
        </h1>

        {/* Loading Message */}
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          {message}
          <span className="inline-block w-8 text-left">{dots}</span>
        </p>

        {/* Progress Bar */}
        <div className="mt-6 w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full animate-progress"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 75%;
            margin-left: 0%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
