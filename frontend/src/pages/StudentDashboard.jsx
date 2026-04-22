import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SummaryCard from "../components/SummaryCard";
import { getStudentDashboardData } from "../services/sponsorshipService";
import LoadingSpinner from "../components/LoadingSpinner";
import PageWrapper from "../components/PageWrapper";
import { GraduationCap, Ticket, AlertCircle, Hand } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
                  // useState: Keeps track of form data and loading spinnerstate, error/success messages, and application history
  const [stats, setStats] = useState({ programs: 0, tickets: 0, openTickets: 0 });
  const [loading, setLoading] = useState(true);
                  // useEffect: Runs automatically when the component loads to fetch data for the dashboard, 
                  // including available sponsorship programs and support tickets. It updates the state with the retrieved data and handles loading state.
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getStudentDashboardData();
        const tickets = data.tickets || [];
        setStats({
          programs: data.programs?.length || 0,
          tickets: tickets.length,
          openTickets: tickets.filter((ticket) => ticket.status !== "RESOLVED").length,
        });
      } catch (error) {
        console.error("Failed to load student dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const isBrandNew = stats.programs === 0 && stats.tickets === 0;

  return (
    <PageWrapper className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-10 shadow-lg text-white">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            Welcome back, {user?.name || "Student"}! <Hand className="text-yellow-400" size={32} />
          </h2>
          <p className="mt-3 text-indigo-100 text-lg max-w-2xl">
            Here's what's happening with your sponsorship applications, tickets, and learning progress today.
          </p>
        </div>
        <div className="hidden md:block">
          {/* Abstract geometric decoration */}
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
            <circle cx="60" cy="60" r="60" fill="white"/>
            <rect x="30" y="30" width="60" height="60" rx="12" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Available Programs"
          value={stats.programs}
          subtitle="Active NGO sponsorships"
          tone="info"
          icon={<GraduationCap className="text-indigo-600" />}
        />
        <SummaryCard
          title="My Tickets"
          value={stats.tickets}
          subtitle="Total support requests"
          tone="default"
          icon={<Ticket className="text-gray-600" />}
        />
        <SummaryCard
          title="Action Needed"
          value={stats.openTickets}
          subtitle="Open unresolved issues"
          tone={stats.openTickets > 0 ? "warning" : "success"}
          icon={<AlertCircle className={stats.openTickets > 0 ? "text-amber-600" : "text-emerald-600"} />}
        />
      </div>

      {isBrandNew ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Ready to dive in?</h3>
          <p className="mt-3 text-gray-500 max-w-md mx-auto text-lg">
            It looks like you haven't interacted with any programs yet. Start exploring and apply for your first sponsorship to level up!
          </p>
          <div className="mt-8">
            <Link
              to="/student/programs"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
            >
              Explore Programs Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Quick Jump</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { to: "/student/programs", label: "Sponsorships", color: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
              { to: "/student/tickets", label: "Support Tickets", color: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
              { to: "/student/gamification", label: "My Activity", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
              { to: "/student/leaderboard", label: "Leaderboard", color: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className={`flex items-center justify-center px-4 py-6 rounded-2xl font-semibold transition-all active:scale-95 ${link.color}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}