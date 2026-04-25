import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getCourseProgress, getMyEnrollments } from "../../services/api";
import { getGamificationData } from "../../services/gamificationService";
import { getStudentApplications } from "../../services/sponsorshipService";

const heroStyle = {
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(29,78,216,0.92) 55%, rgba(96,165,250,0.88) 100%)",
  border: "1px solid rgba(191, 219, 254, 0.55)",
  borderRadius: 28,
  padding: 32,
  marginBottom: 32,
  color: "#FFFFFF",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
};

const panelStyle = {
  background: "#F8FBFF",
  border: "1px solid #DBEAFE",
  borderRadius: 22,
  padding: 24,
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [progresses, setProgresses] = useState({});
  const [gamification, setGamification] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [enrollmentRes, gamificationRes, sponsorshipRes] = await Promise.all([
          getMyEnrollments(),
          getGamificationData(),
          getStudentApplications(),
        ]);

        const nextEnrollments = enrollmentRes.data.data || [];
        setEnrollments(nextEnrollments);
        setGamification(gamificationRes.data.data || null);
        setApplications(sponsorshipRes.applications || []);

        const nextProgress = {};
        await Promise.all(
          nextEnrollments.map(async (enrollment) => {
            try {
              const progressRes = await getCourseProgress(enrollment.course._id);
              nextProgress[enrollment.course._id] = progressRes.data.data;
            } catch {
              nextProgress[enrollment.course._id] = null;
            }
          })
        );
        setProgresses(nextProgress);
      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-v2">
      <section style={heroStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 720 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Student Control Center
            </div>
            <h2 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 12, color: "#FFFFFF" }}>
              Welcome back, {user?.name || "Learner"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 16, maxWidth: 620 }}>
              Pick up where you left off, monitor your progress, and keep building rewards through
              courses, missions, quizzes, and sponsorship support.
            </p>
          </div>

          <div style={{ display: "grid", gap: 12, minWidth: 220 }}>
            <div style={{ ...panelStyle, background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.16)" }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
                Active Courses
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{enrollments.length}</div>
            </div>
            <div style={{ ...panelStyle, background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.16)" }}>
              <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
                Reward Points
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{gamification?.points || 0}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">LP</div>
          <div>
            <div className="stat-value">{gamification?.points || 0}</div>
            <div className="stat-label">Learning Points</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">BD</div>
          <div>
            <div className="stat-value">{gamification?.badges?.length || 0}</div>
            <div className="stat-label">Badges Earned</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">MS</div>
          <div>
            <div className="stat-value">{gamification?.totalMissionsDone || 0}</div>
            <div className="stat-label">Missions Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">SP</div>
          <div>
            <div className="stat-value">{applications.length}</div>
            <div className="stat-label">Sponsorship Requests</div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 24 }}>
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Continue Learning</h3>
              <p className="section-sub" style={{ marginTop: 6 }}>
                Open your most recent courses and resume the next lesson.
              </p>
            </div>
            <Link to="/my-courses" className="btn btn-secondary">
              View all
            </Link>
          </div>

          <div className="card-body" style={{ padding: 24 }}>
            {enrollments.length === 0 ? (
              <div className="empty-state" style={{ padding: "52px 20px" }}>
                <div className="empty-state-icon">SC</div>
                <h3>No active courses yet</h3>
                <p>Start with the course catalog and enroll in a learning path that fits your goals.</p>
                <Link to="/browse" className="btn btn-primary">
                  Browse courses
                </Link>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {enrollments.slice(0, 3).map((enrollment) => {
                  const progress = progresses[enrollment.course._id]?.completionPercentage ?? 0;
                  return (
                    <div key={enrollment._id} style={panelStyle}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 18,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 220 }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                            {enrollment.course.title}
                          </div>
                          <div style={{ color: "#64748B", marginBottom: 14 }}>
                            {enrollment.course.category} course
                          </div>
                          <div style={{ height: 10, background: "#DBEAFE", borderRadius: 999, overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, #60A5FA 0%, #2563EB 100%)",
                                height: "100%",
                              }}
                            />
                          </div>
                          <div style={{ marginTop: 10, color: "#1D4ED8", fontSize: 13, fontWeight: 700 }}>
                            {progress}% complete
                          </div>
                        </div>

                        <Link to={`/course/${enrollment.course._id}`} className="btn btn-primary">
                          Resume
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div style={{ display: "grid", gap: 24 }}>
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Achievements</h3>
            </div>
            <div className="card-body" style={{ padding: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {(gamification?.badges || []).length === 0 ? (
                  <div className="empty-state" style={{ padding: "28px 20px" }}>
                    <h3>No badges yet</h3>
                    <p>Complete lessons and assessments to unlock your first milestone.</p>
                  </div>
                ) : (
                  gamification.badges.map((badge, index) => (
                    <div key={badge._id || badge.id || index} style={{ ...panelStyle, minWidth: 110, textAlign: "center" }}>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#1D4ED8", marginBottom: 8 }}>BG</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{badge.name || "Badge"}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body" style={{ padding: 24, display: "grid", gap: 12 }}>
              <Link to="/student/gamification" className="btn btn-primary" style={{ justifyContent: "center" }}>
                Open rewards dashboard
              </Link>
              <Link to="/student/programs" className="btn btn-secondary" style={{ justifyContent: "center" }}>
                Explore sponsorships
              </Link>
              <Link to="/student/redeem" className="btn btn-secondary" style={{ justifyContent: "center" }}>
                Redeem fee reductions
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
