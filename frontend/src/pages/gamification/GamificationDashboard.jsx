import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGamification } from "../../context/GamificationContext";
import useAuth from "../../hooks/useAuth";

export default function GamificationDashboard() {
  const { fetchAchievements, achievements, loading } = useGamification();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "badges", label: "Badges" },
    { id: "certificates", label: "Certificates" },
    { id: "rewards", label: "Rewards" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      <nav className="nav-glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/student" style={{ fontSize: '20px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/student" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Home</Link>
              <Link to="/student/gamification" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 600, fontSize: '14px' }}>Activity</Link>
              <Link to="/student/leaderboard" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Leaderboard</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#62625b', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px', backgroundColor: '#e60023', color: 'white' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Points</div>
            <div style={{ fontSize: '36px', fontWeight: 700 }}>{achievements?.totalPoints || 0}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#62625b' }}>Badges</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#211922' }}>{achievements?.badges?.length || 0}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#62625b' }}>Certificates</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#211922' }}>{achievements?.certificates?.length || 0}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#62625b' }}>My Rank</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#211922' }}>#-</div>
          </div>
        </div>

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
            {activeTab === "overview" && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Recent Activity</h3>
                  {achievements?.pointsHistory?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {achievements.pointsHistory.slice(0, 5).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f6f6f3', borderRadius: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 500, color: '#211922' }}>{item.description}</div>
                            <div style={{ fontSize: '12px', color: '#91918c' }}>{new Date(item.earnedAt).toLocaleDateString()}</div>
                          </div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#e60023' }}>+{item.points}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#62625b' }}>No activity yet. Complete courses to earn points!</p>
                  )}
                </div>
                <div className="card" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Available Rewards</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#fff5f5', borderRadius: '12px', border: '1px solid #ffdddd' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#211922' }}>10% Discount</div>
                        <div style={{ fontSize: '12px', color: '#62625b' }}>100 points</div>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#e60023', color: 'white', fontSize: '12px', fontWeight: 500 }}>Unlock</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f6f6f3', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 500, color: '#211922' }}>20% Discount</div>
                        <div style={{ fontSize: '12px', color: '#62625b' }}>300 points</div>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: '12px', backgroundColor: '#e5e5e0', color: '#62625b', fontSize: '12px' }}>Locked</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "badges" && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {achievements?.badges?.length > 0 ? (
                  achievements.badges.map((userBadge) => (
                    <div key={userBadge._id} className="card" style={{ padding: '24px', textAlign: 'center' }}>
                      <div style={{ width: '80px', height: '80px', margin: '0 auto 16px', backgroundColor: '#e5e5e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                        {userBadge.badge?.icon || '🏆'}
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{userBadge.badge?.name}</h4>
                      <p style={{ fontSize: '13px', color: '#62625b', marginBottom: '8px' }}>{userBadge.badge?.description}</p>
                      <p style={{ fontSize: '11px', color: '#91918c' }}>{new Date(userBadge.earnedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#62625b' }}>
                    No badges earned yet. Complete courses to earn badges!
                  </div>
                )}
              </div>
            )}

            {activeTab === "certificates" && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {achievements?.certificates?.length > 0 ? (
                  achievements.certificates.map((cert) => (
                    <div key={cert._id} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff5f5' }}>
                      <div style={{ width: '60px', height: '60px', backgroundColor: '#e60023', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', flexShrink: 0 }}>🎓</div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Certificate of Completion</h4>
                        <p style={{ fontSize: '13px', color: '#62625b', fontFamily: 'monospace' }}>{cert.certificateNumber}</p>
                        <p style={{ fontSize: '12px', color: '#91918c', marginTop: '4px' }}>{new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#62625b' }}>
                    No certificates yet. Complete all courses to earn certificates!
                  </div>
                )}
              </div>
            )}

            {activeTab === "rewards" && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>My Fee Reductions</h3>
                {achievements?.feeReductions?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {achievements.feeReductions.map((reduction) => (
                      <div key={reduction._id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: 600, color: '#211922' }}>{reduction.discountPercentage}% Discount</div>
                          <div style={{ fontSize: '14px', color: '#62625b' }}>{reduction.reason}</div>
                        </div>
                        <button className="btn-primary" style={{ padding: '8px 16px' }}>Use Now</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px', color: '#62625b' }}>
                    No fee reductions yet. Earn more points to unlock discounts!
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}