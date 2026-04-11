import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gamificationService } from "../../services/gamificationService";
import useAuth from "../../hooks/useAuth";

export default function AdminGamification() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState([]);
  const [pointRules, setPointRules] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [badgesRes, rulesRes, certsRes] = await Promise.all([
        gamificationService.getAllBadges(),
        gamificationService.getPointRules(),
        gamificationService.getAllCertificates(),
      ]);
      setBadges(badgesRes.data.data || []);
      setPointRules(rulesRes.data.data || []);
      setCertificates(certsRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [newBadge, setNewBadge] = useState({ name: "", description: "", icon: "🏆", criteria: { type: "points_threshold", threshold: 100 }, isActive: true });
  const [newRule, setNewRule] = useState({ action: "", points: 0, description: "", isActive: true });

  const handleCreateBadge = async (e) => {
    e.preventDefault();
    try {
      await gamificationService.createBadge(newBadge);
      setShowBadgeForm(false);
      setNewBadge({ name: "", description: "", icon: "🏆", criteria: { type: "points_threshold", threshold: 100 }, isActive: true });
      fetchData();
    } catch (err) {
      console.error("Error creating badge:", err);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      await gamificationService.createPointRule(newRule);
      setShowRuleForm(false);
      setNewRule({ action: "", points: 0, description: "", isActive: true });
      fetchData();
    } catch (err) {
      console.error("Error creating rule:", err);
    }
  };

  const handleDeleteBadge = async (id) => {
    if (confirm("Delete this badge?")) {
      try {
        await gamificationService.deleteBadge(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting badge:", err);
      }
    }
  };

  const tabs = [
    { id: "badges", label: "Badges" },
    { id: "rules", label: "Point Rules" },
    { id: "certificates", label: "Certificates" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      <nav className="nav-glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/admin" style={{ fontSize: '20px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Dashboard</Link>
              <Link to="/admin/gamification" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 600, fontSize: '14px' }}>Gamification</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#62625b', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 16px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '24px' }}>Gamification Management</h2>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e5e0', paddingBottom: '12px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '14px',
                backgroundColor: activeTab === tab.id ? '#211922' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#62625b',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#62625b' }}>Loading...</div>
        ) : (
          <>
            {activeTab === "badges" && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>All Badges</h3>
                  <button onClick={() => setShowBadgeForm(!showBadgeForm)} className="btn-primary" style={{ padding: '8px 16px' }}>
                    {showBadgeForm ? "Cancel" : "Add Badge"}
                  </button>
                </div>

                {showBadgeForm && (
                  <form onSubmit={handleCreateBadge} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <input type="text" placeholder="Badge Name" value={newBadge.name} onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })} style={{ width: '100%' }} required />
                      <input type="text" placeholder="Description" value={newBadge.description} onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })} style={{ width: '100%' }} />
                      <select value={newBadge.criteria.type} onChange={(e) => setNewBadge({ ...newBadge, criteria: { ...newBadge.criteria, type: e.target.value } })} style={{ width: '100%' }}>
                        <option value="points_threshold">Points Threshold</option>
                        <option value="course_completion">Course Completion</option>
                        <option value="quiz_score">Quiz Score</option>
                      </select>
                      <input type="number" placeholder="Threshold" value={newBadge.criteria.threshold} onChange={(e) => setNewBadge({ ...newBadge, criteria: { ...newBadge.criteria, threshold: Number(e.target.value) } })} style={{ width: '100%' }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Create Badge</button>
                  </form>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {badges.map((badge) => (
                    <div key={badge._id} className="card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontSize: '32px' }}>{badge.icon}</div>
                        <button onClick={() => handleDeleteBadge(badge._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginTop: '12px', marginBottom: '4px' }}>{badge.name}</h4>
                      <p style={{ fontSize: '13px', color: '#62625b', marginBottom: '8px' }}>{badge.description}</p>
                      <p style={{ fontSize: '11px', color: '#91918c' }}>Type: {badge.criteria?.type} | Threshold: {badge.criteria?.threshold}</p>
                      <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', backgroundColor: badge.isActive ? '#e6f4ea' : '#f6f6f3', color: badge.isActive ? '#137333' : '#62625b' }}>
                        {badge.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Point Rules</h3>
                  <button onClick={() => setShowRuleForm(!showRuleForm)} className="btn-primary" style={{ padding: '8px 16px' }}>
                    {showRuleForm ? "Cancel" : "Add Rule"}
                  </button>
                </div>

                {showRuleForm && (
                  <form onSubmit={handleCreateRule} className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <select value={newRule.action} onChange={(e) => setNewRule({ ...newRule, action: e.target.value })} style={{ width: '100%' }} required>
                        <option value="">Select Action</option>
                        <option value="course_completion">Course Completion</option>
                        <option value="quiz_pass">Quiz Pass</option>
                        <option value="mission_completion">Mission Completion</option>
                      </select>
                      <input type="number" placeholder="Points" value={newRule.points} onChange={(e) => setNewRule({ ...newRule, points: Number(e.target.value) })} style={{ width: '100%' }} required />
                      <input type="text" placeholder="Description" value={newRule.description} onChange={(e) => setNewRule({ ...newRule, description: e.target.value })} style={{ width: '100%' }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input type="checkbox" checked={newRule.isActive} onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })} />
                        Active
                      </label>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Create Rule</button>
                  </form>
                )}

                <div className="card" style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f6f6f3' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Action</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Points</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Description</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointRules.map((rule) => (
                        <tr key={rule._id} style={{ borderTop: '1px solid #e5e5e0' }}>
                          <td style={{ padding: '16px', fontWeight: 500 }}>{rule.action}</td>
                          <td style={{ padding: '16px' }}>{rule.points}</td>
                          <td style={{ padding: '16px', color: '#62625b' }}>{rule.description}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', backgroundColor: rule.isActive ? '#e6f4ea' : '#f6f6f3', color: rule.isActive ? '#137333' : '#62625b' }}>
                              {rule.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "certificates" && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>All Certificates</h3>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f6f6f3' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Certificate #</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Student</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Issued Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert._id} style={{ borderTop: '1px solid #e5e5e0' }}>
                          <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '13px' }}>{cert.certificateNumber}</td>
                          <td style={{ padding: '16px' }}>{cert.student?.name || "N/A"}</td>
                          <td style={{ padding: '16px', color: '#62625b' }}>{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}