import { useEffect, useState } from "react";
import { gamificationService } from "../../services/gamificationService";

const badgeTone = (active) => (active ? "status-pill--success" : "status-pill--warning");

export default function AdminGamification() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState([]);
  const [pointRules, setPointRules] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [editingBadgeId, setEditingBadgeId] = useState("");
  const [editingRuleId, setEditingRuleId] = useState("");
  const [newBadge, setNewBadge] = useState({
    name: "",
    description: "",
    icon: "TB",
    criteria: { type: "points_threshold", threshold: 100 },
    isActive: true,
  });
  const [newRule, setNewRule] = useState({
    action: "",
    points: 0,
    description: "",
    isActive: true,
  });

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBadge = async (event) => {
    event.preventDefault();
    try {
      if (editingBadgeId) {
        await gamificationService.updateBadge(editingBadgeId, newBadge);
      } else {
        await gamificationService.createBadge(newBadge);
      }
      setShowBadgeForm(false);
      setEditingBadgeId("");
      setNewBadge({
        name: "",
        description: "",
        icon: "TB",
        criteria: { type: "points_threshold", threshold: 100 },
        isActive: true,
      });
      fetchData();
    } catch (err) {
      console.error("Error creating badge:", err);
    }
  };

  const handleCreateRule = async (event) => {
    event.preventDefault();
    try {
      if (editingRuleId) {
        await gamificationService.updatePointRule(editingRuleId, newRule);
      } else {
        await gamificationService.createPointRule(newRule);
      }
      setShowRuleForm(false);
      setEditingRuleId("");
      setNewRule({ action: "", points: 0, description: "", isActive: true });
      fetchData();
    } catch (err) {
      console.error("Error creating rule:", err);
    }
  };

  const handleDeleteBadge = async (id) => {
    if (window.confirm("Delete this badge?")) {
      try {
        await gamificationService.deleteBadge(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting badge:", err);
      }
    }
  };

  const handleEditBadge = (badge) => {
    setEditingBadgeId(badge._id);
    setShowBadgeForm(true);
    setNewBadge({
      name: badge.name || "",
      description: badge.description || "",
      icon: badge.icon || "TB",
      criteria: {
        type: badge.criteria?.type || "points_threshold",
        threshold: badge.criteria?.threshold ?? 100,
      },
      isActive: badge.isActive ?? true,
    });
  };

  const handleEditRule = (rule) => {
    setEditingRuleId(rule._id);
    setShowRuleForm(true);
    setNewRule({
      action: rule.action || "",
      points: rule.points ?? 0,
      description: rule.description || "",
      isActive: rule.isActive ?? true,
    });
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm("Delete this point rule?")) {
      try {
        await gamificationService.deletePointRule(id);
        fetchData();
      } catch (err) {
        console.error("Error deleting point rule:", err);
      }
    }
  };

  const resetBadgeForm = () => {
    setShowBadgeForm(false);
    setEditingBadgeId("");
    setNewBadge({
      name: "",
      description: "",
      icon: "TB",
      criteria: { type: "points_threshold", threshold: 100 },
      isActive: true,
    });
  };

  const resetRuleForm = () => {
    setShowRuleForm(false);
    setEditingRuleId("");
    setNewRule({ action: "", points: 0, description: "", isActive: true });
  };

  const tabs = [
    { id: "badges", label: "Badges" },
    { id: "rules", label: "Point Rules" },
    { id: "certificates", label: "Certificates" },
  ];

  return (
    <div className="workspace-stack">
      <section className="workspace-hero">
        <h2>Gamification Management</h2>
        <p>Badges, point rules, and certificate records now use a proper admin tile layout instead of the previous nested mini-page design.</p>
      </section>

      <section className="content-panel">
        <div className="content-panel__header">
          <div>
            <h3 className="content-panel__title">Management Sections</h3>
            <p className="content-panel__sub">Switch between badge administration, point rules, and certificate records.</p>
          </div>
          <div className="admin-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab${activeTab === tab.id ? " active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="content-panel__body">
          {loading ? (
            <div className="empty-panel">Loading gamification data...</div>
          ) : (
            <>
              {activeTab === "badges" && (
                <div className="workspace-stack">
                  <div className="field-inline">
                    <div>
                      <h4 className="content-panel__title" style={{ fontSize: 20 }}>Badge Library</h4>
                      <p className="content-panel__sub">Each badge is now rendered as a clean management tile.</p>
                    </div>
                    <button
                      onClick={() => (showBadgeForm ? resetBadgeForm() : setShowBadgeForm(true))}
                      className="btn btn-primary"
                    >
                      {showBadgeForm ? "Close Form" : "Add Badge"}
                    </button>
                  </div>

                  {showBadgeForm && (
                    <section className="content-panel">
                      <div className="content-panel__body">
                        <form onSubmit={handleCreateBadge} className="field-stack">
                          <div className="field-grid">
                            <input
                              type="text"
                              placeholder="Badge name"
                              value={newBadge.name}
                              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                              className="form-control"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Description"
                              value={newBadge.description}
                              onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                              className="form-control"
                              required
                            />
                            <select
                              value={newBadge.criteria.type}
                              onChange={(e) => setNewBadge({ ...newBadge, criteria: { ...newBadge.criteria, type: e.target.value } })}
                              className="form-control"
                            >
                              <option value="points_threshold">Points Threshold</option>
                              <option value="course_completion">Course Completion</option>
                              <option value="quiz_score">Quiz Score</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Threshold"
                              value={newBadge.criteria.threshold}
                              onChange={(e) => setNewBadge({ ...newBadge, criteria: { ...newBadge.criteria, threshold: Number(e.target.value) } })}
                              className="form-control"
                            />
                          </div>
                          <div className="tile-actions">
                            <button type="submit" className="btn btn-primary">
                              {editingBadgeId ? "Update Badge" : "Create Badge"}
                            </button>
                            <button type="button" onClick={resetBadgeForm} className="btn btn-secondary">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </section>
                  )}

                  <div className="tile-grid">
                    {badges.map((badge) => (
                      <article key={badge._id} className="tile-card">
                        <div className="tile-top">
                          <div>
                            <h4 className="tile-title">{badge.name}</h4>
                            <p className="tile-subtitle">{badge.description || "Badge criteria configured by admin."}</p>
                          </div>
                          <span className={`status-pill ${badgeTone(badge.isActive)}`}>
                            {badge.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="tile-meta">
                          <div className="tile-meta-row">
                            <span>Criteria Type</span>
                            <strong>{badge.criteria?.type || "N/A"}</strong>
                          </div>
                          <div className="tile-meta-row">
                            <span>Threshold</span>
                            <strong>{badge.criteria?.threshold ?? "N/A"}</strong>
                          </div>
                        </div>

                        <div className="tile-actions">
                          <button onClick={() => handleEditBadge(badge)} className="btn btn-secondary btn-sm">
                            Edit Badge
                          </button>
                          <button onClick={() => handleDeleteBadge(badge._id)} className="btn btn-danger btn-sm">
                            Delete Badge
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "rules" && (
                <div className="workspace-stack">
                  <div className="field-inline">
                    <div>
                      <h4 className="content-panel__title" style={{ fontSize: 20 }}>Point Rules</h4>
                      <p className="content-panel__sub">Rules are displayed as clear tables and form sections instead of plain blocks.</p>
                    </div>
                    <button
                      onClick={() => (showRuleForm ? resetRuleForm() : setShowRuleForm(true))}
                      className="btn btn-primary"
                    >
                      {showRuleForm ? "Close Form" : "Add Rule"}
                    </button>
                  </div>

                  {showRuleForm && (
                    <section className="content-panel">
                      <div className="content-panel__body">
                        <form onSubmit={handleCreateRule} className="field-stack">
                          <div className="field-grid">
                            <select
                              value={newRule.action}
                              onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                              className="form-control"
                              required
                            >
                              <option value="">Select Action</option>
                              <option value="course_completion">Course Completion</option>
                              <option value="lesson_completion">Lesson Completion</option>
                              <option value="quiz_pass">Quiz Pass</option>
                              <option value="mission_completion">Mission Completion</option>
                              <option value="first_enrollment">First Enrollment</option>
                            </select>
                            <input
                              type="number"
                              placeholder="Points"
                              value={newRule.points}
                              onChange={(e) => setNewRule({ ...newRule, points: Number(e.target.value) })}
                              className="form-control"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Description"
                              value={newRule.description}
                              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                              className="form-control"
                            />
                            <div className="form-control" style={{ display: "flex", alignItems: "center" }}>
                              <label className="checkbox-inline">
                                <input
                                  type="checkbox"
                                  checked={newRule.isActive}
                                  onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                                />
                                Active rule
                              </label>
                            </div>
                          </div>
                          <div className="tile-actions">
                            <button type="submit" className="btn btn-primary">
                              {editingRuleId ? "Update Rule" : "Create Rule"}
                            </button>
                            <button type="button" onClick={resetRuleForm} className="btn btn-secondary">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </section>
                  )}

                  <div className="card" style={{ overflow: "hidden" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Points</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pointRules.map((rule) => (
                          <tr key={rule._id}>
                            <td>{rule.action}</td>
                            <td>{rule.points}</td>
                            <td>{rule.description || "No description"}</td>
                            <td>
                              <span className={`status-pill ${rule.isActive ? "status-pill--success" : "status-pill--warning"}`}>
                                {rule.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <div className="actions">
                                <button onClick={() => handleEditRule(rule)} className="btn btn-secondary btn-sm">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteRule(rule._id)} className="btn btn-danger btn-sm">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "certificates" && (
                <div className="workspace-stack">
                  <div>
                    <h4 className="content-panel__title" style={{ fontSize: 20 }}>Issued Certificates</h4>
                    <p className="content-panel__sub">Certificate records are now grouped inside the same admin surface.</p>
                  </div>
                  <div className="card" style={{ overflow: "hidden" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Certificate #</th>
                          <th>Student</th>
                          <th>Issued Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {certificates.map((certificate) => (
                          <tr key={certificate._id}>
                            <td>{certificate.certificateNumber}</td>
                            <td>{certificate.student?.name || "N/A"}</td>
                            <td>{certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : "N/A"}</td>
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
      </section>
    </div>
  );
}
