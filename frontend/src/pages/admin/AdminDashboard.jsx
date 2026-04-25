import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const heroStyle = {
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,64,175,0.94) 52%, rgba(96,165,250,0.84) 100%)",
  borderRadius: 28,
  padding: 32,
  color: "#FFFFFF",
  marginBottom: 32,
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
};

const systemHealth = [
  { service: "Core API", status: "Operational", latency: "24ms", tone: "badge-green" },
  { service: "Learning Delivery", status: "Operational", latency: "12ms", tone: "badge-green" },
  { service: "Offline Sync", status: "Monitoring", latency: "105ms", tone: "badge-yellow" },
  { service: "Gamification Engine", status: "Operational", latency: "8ms", tone: "badge-green" },
];

const modules = [
  { label: "Courses", to: "/admin/courses", description: "Create, edit, publish, and organize course content." },
  { label: "Assessment Hub", to: "/admin/assessment", description: "Manage missions, quizzes, and grading workflows." },
  { label: "Gamification", to: "/admin/gamification", description: "Configure points, rules, badges, and rewards." },
  { label: "Support", to: "/admin/tickets", description: "Review student tickets and resolve platform issues." },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
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
              Platform Operations
            </div>
            <h2 style={{ fontSize: 34, lineHeight: 1.1, marginBottom: 12, color: "rgba(255,255,255,0.84)" }}>Administrator command center</h2>
            <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 16, maxWidth: 620 }}>
              Keep the learning platform healthy, publish content, and coordinate assessments,
              rewards, and support queues from one place.
            </p>
          </div>

          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
              Active session
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>{user?.name || "Admin"}</div>
            <div style={{ color: "rgba(255,255,255,0.8)" }}>Admin access with full management controls</div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">LR</div>
          <div>
            <div className="stat-value">2,405</div>
            <div className="stat-label">Active Learners</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">NG</div>
          <div>
            <div className="stat-value">48</div>
            <div className="stat-label">NGO Partners</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">CR</div>
          <div>
            <div className="stat-value">112</div>
            <div className="stat-label">Live Courses</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">CF</div>
          <div>
            <div className="stat-value">892</div>
            <div className="stat-label">Certificates Issued</div>
          </div>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 24 }}>
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Management modules</h3>
              <p className="section-sub" style={{ marginTop: 6 }}>
                Jump into the areas that keep the platform running smoothly.
              </p>
            </div>
          </div>
          <div className="card-body" style={{ padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {modules.map((module) => (
              <Link key={module.to} to={module.to} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: "#F8FBFF",
                    border: "1px solid #DBEAFE",
                    borderRadius: 22,
                    padding: 20,
                    minHeight: 156,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#3B82F6", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em", marginBottom: 10 }}>
                      Module
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                      {module.label}
                    </div>
                    <p style={{ color: "#64748B", lineHeight: 1.6 }}>{module.description}</p>
                  </div>
                  <div style={{ marginTop: 18, color: "#1D4ED8", fontWeight: 700 }}>Open workspace</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div style={{ display: "grid", gap: 24 }}>
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">System health</h3>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {systemHealth.map((item) => (
                    <tr key={item.service}>
                      <td>{item.service}</td>
                      <td>
                        <span className={`badge ${item.tone}`}>{item.status}</span>
                      </td>
                      <td>{item.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Operations focus</h3>
            </div>
            <div className="card-body" style={{ padding: 24, display: "grid", gap: 14 }}>
              <div style={{ background: "#F8FBFF", border: "1px solid #DBEAFE", borderRadius: 18, padding: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginBottom: 4 }}>Today</div>
                <div style={{ color: "#0F172A", fontWeight: 700 }}>Review open tickets and publish queued courses.</div>
              </div>
              <div style={{ background: "#F8FBFF", border: "1px solid #DBEAFE", borderRadius: 18, padding: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginBottom: 4 }}>This week</div>
                <div style={{ color: "#0F172A", fontWeight: 700 }}>Audit gamification rules and validate assessment coverage.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
