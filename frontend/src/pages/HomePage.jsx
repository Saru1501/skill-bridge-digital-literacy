import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">SkillBridge</div>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  const role = user?.role?.toLowerCase();
                  if (role === "admin") navigate("/admin");
                  else if (role === "ngo") navigate("/ngo");
                  else navigate("/student");
                }}
                className="px-6 py-2 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-white font-medium hover:text-indigo-200 transition border border-white/30 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition"
              >
                Join Now
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Learn. Grow. Achieve.
          </h1>
          <p className="text-xl text-indigo-200 mb-10">
            Digital literacy platform for rural youth. Gamified learning with courses, 
            quizzes, and rewards. Get sponsored by NGOs and earn certificates!
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition text-lg"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Learn Anywhere</h3>
            <p className="text-indigo-200">
              Access courses offline and sync progress. Learn at your own pace with downloadable resources.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Earn Rewards</h3>
            <p className="text-indigo-200">
              Earn points, badges, and certificates. Climb the leaderboard and get fee reductions!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-white">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Get Sponsored</h3>
            <p className="text-indigo-200">
              Apply for NGO sponsorship. Get financial support for your learning journey.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-16 mt-20 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold">10K+</div>
            <div className="text-indigo-200">Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">100+</div>
            <div className="text-indigo-200">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">50+</div>
            <div className="text-indigo-200">NGOs</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-indigo-300 py-8">
        © 2024 SkillBridge Digital Literacy. All rights reserved.
      </footer>
    </div>
  );
}