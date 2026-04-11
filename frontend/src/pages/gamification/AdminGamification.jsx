import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gamificationService } from "../../services/gamificationService";
import Navbar from "../../components/Navbar";

export default function AdminGamification() {
  const [activeTab, setActiveTab] = useState("badges");
  const [badges, setBadges] = useState([]);
  const [pointRules, setPointRules] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
    { id: "badges", label: "Manage Badges" },
    { id: "rules", label: "Point Rules" },
    { id: "certificates", label: "Certificates" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#222222', letterSpacing: '-0.18px' }}>Gamification Management</h2>

        <div className="flex border-b mb-6" style={{ borderBottom: '1px solid #f2f2f2' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 font-medium transition-colors"
              style={{ 
                fontWeight: 600,
                fontSize: '14px',
                color: activeTab === tab.id ? '#222222' : '#6a6a6a',
                borderBottom: activeTab === tab.id ? '2px solid #222222' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {activeTab === "badges" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">All Badges</h3>
                  <button
                    onClick={() => setShowBadgeForm(!showBadgeForm)}
                    className="px-4 py-2 rounded-lg transition hover:shadow-lg" style={{ backgroundColor: '#ff385c', color: '#ffffff', fontWeight: 500, fontSize: '14px' }}
                  >
                    {showBadgeForm ? "Cancel" : "Add Badge"}
                  </button>
                </div>

                {showBadgeForm && (
                  <form onSubmit={handleCreateBadge} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Badge Name"
                        value={newBadge.name}
                        onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                        className="p-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newBadge.description}
                        onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                        className="p-2 border rounded-lg"
                      />
                      <select
                        value={newBadge.criteria.type}
                        onChange={(e) => setNewBadge({ ...newBadge, criteria: { ...newBadge.criteria, type: e.target.value } })}
                        className="p-2 border rounded-lg"
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
                        className="p-2 border rounded-lg"
                      />
                    </div>
                    <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Create Badge
                    </button>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div key={badge._id} className="bg-white rounded-xl shadow-sm p-4">
                      <div className="flex justify-between items-start">
                        <div className="text-4xl">{badge.icon}</div>
                        <button onClick={() => handleDeleteBadge(badge._id)} className="text-red-500 hover:text-red-700">🗑️</button>
                      </div>
                      <h4 className="font-semibold mt-2">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        Type: {badge.criteria?.type} | Threshold: {badge.criteria?.threshold}
                      </div>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${badge.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {badge.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Point Rules</h3>
                  <button
                    onClick={() => setShowRuleForm(!showRuleForm)}
                    className="px-4 py-2 rounded-lg transition hover:shadow-lg" style={{ backgroundColor: '#ff385c', color: '#ffffff', fontWeight: 500, fontSize: '14px' }}
                  >
                    {showRuleForm ? "Cancel" : "Add Rule"}
                  </button>
                </div>

                {showRuleForm && (
                  <form onSubmit={handleCreateRule} className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={newRule.action}
                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                        className="p-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Action</option>
                        <option value="course_completion">Course Completion</option>
                        <option value="quiz_pass">Quiz Pass</option>
                        <option value="mission_completion">Mission Completion</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Points"
                        value={newRule.points}
                        onChange={(e) => setNewRule({ ...newRule, points: Number(e.target.value) })}
                        className="p-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={newRule.description}
                        onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                        className="p-2 border rounded-lg"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newRule.isActive}
                          onChange={(e) => setNewRule({ ...newRule, isActive: e.target.checked })}
                        />
                        Active
                      </label>
                    </div>
                    <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Create Rule
                    </button>
                  </form>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Action</th>
                        <th className="px-4 py-3 text-left">Points</th>
                        <th className="px-4 py-3 text-left">Description</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointRules.map((rule) => (
                        <tr key={rule._id} className="border-t">
                          <td className="px-4 py-3 font-medium">{rule.action}</td>
                          <td className="px-4 py-3">{rule.points}</td>
                          <td className="px-4 py-3 text-gray-500">{rule.description}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded ${rule.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
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
                <h3 className="text-lg font-semibold mb-4">All Certificates</h3>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Certificate #</th>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Issued Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert._id} className="border-t">
                          <td className="px-4 py-3 font-mono text-sm">{cert.certificateNumber}</td>
                          <td className="px-4 py-3">{cert.student?.name || "N/A"}</td>
                          <td className="px-4 py-3">{cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "N/A"}</td>
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