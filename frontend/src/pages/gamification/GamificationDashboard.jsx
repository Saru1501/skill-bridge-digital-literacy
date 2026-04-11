import { useEffect, useState } from "react";
import { useGamification } from "../../context/GamificationContext";
import Navbar from "../../components/Navbar";

export default function GamificationDashboard() {
  const { fetchAchievements, achievements, loading } = useGamification();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "badges", label: "Badges" },
    { id: "certificates", label: "Certificates" },
    { id: "rewards", label: "My Rewards" },
  ];

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div 
            className="p-6"
            style={{ 
              ...cardStyle,
              background: 'linear-gradient(135deg, #ff385c 0%, #e00b41 100%)',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Total Points</div>
            <div className="text-4xl font-bold">{achievements?.totalPoints || 0}</div>
          </div>
          <div 
            className="p-6"
            style={{ 
              ...cardStyle,
              background: 'linear-gradient(135deg, #460479 0%, #92174d 100%)',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Badges Earned</div>
            <div className="text-4xl font-bold">{achievements?.badges?.length || 0}</div>
          </div>
          <div 
            className="p-6"
            style={{ 
              ...cardStyle,
              background: 'linear-gradient(135deg, #222222 0%, #3f3f3f 100%)',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Certificates</div>
            <div className="text-4xl font-bold">{achievements?.certificates?.length || 0}</div>
          </div>
          <div 
            className="p-6"
            style={{ 
              ...cardStyle,
              background: 'linear-gradient(135deg, #6a6a6a 0%, #222222 100%)',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.8 }}>My Rank</div>
            <div className="text-4xl font-bold">#-</div>
          </div>
        </div>

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
          <div className="text-center py-8" style={{ color: '#6a6a6a' }}>Loading...</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6" style={cardStyle}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#222222' }}>Recent Activity</h3>
                  {achievements?.pointsHistory?.length > 0 ? (
                    <div className="space-y-3">
                      {achievements.pointsHistory.slice(0, 5).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#f2f2f2' }}>
                          <div>
                            <div className="font-medium" style={{ color: '#222222', fontSize: '14px' }}>{item.description}</div>
                            <div style={{ color: '#6a6a6a', fontSize: '12px' }}>{new Date(item.earnedAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-lg font-bold" style={{ color: '#ff385c' }}>+{item.points}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#6a6a6a' }}>No recent activity</p>
                  )}
                </div>
                <div className="p-6" style={cardStyle}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#222222' }}>Available Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#f2f2f2', border: '1px solid #c1c1c1' }}>
                      <div>
                        <div className="font-medium" style={{ color: '#222222' }}>10% Discount</div>
                        <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Earn 100 points</div>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#ff385c', color: '#ffffff', fontWeight: 600 }}
                      >
                        Available
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#f2f2f2', border: '1px solid #c1c1c1' }}>
                      <div>
                        <div className="font-medium" style={{ color: '#222222' }}>20% Discount</div>
                        <div style={{ color: '#6a6a6a', fontSize: '14px' }}>Earn 300 points</div>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#c1c1c1', color: '#ffffff', fontWeight: 600 }}
                      >
                        Locked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "badges" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements?.badges?.length > 0 ? (
                  achievements.badges.map((userBadge) => (
                    <div key={userBadge._id} className="p-6 text-center" style={cardStyle}>
                      <div 
                        className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl"
                        style={{ background: 'linear-gradient(135deg, #ff385c 0%, #e00b41 100%)' }}
                      >
                        {userBadge.badge?.icon || "🏆"}
                      </div>
                      <h4 className="font-semibold text-lg" style={{ color: '#222222' }}>{userBadge.badge?.name}</h4>
                      <p style={{ color: '#6a6a6a', fontSize: '14px' }}>{userBadge.badge?.description}</p>
                      <p style={{ color: '#6a6a6a', fontSize: '12px', marginTop: '8px' }}>
                        Earned: {new Date(userBadge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12" style={{ color: '#6a6a6a' }}>
                    No badges earned yet. Complete courses and quizzes to earn badges!
                  </div>
                )}
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements?.certificates?.length > 0 ? (
                  achievements.certificates.map((cert) => (
                    <div 
                      key={cert._id} 
                      className="p-6 rounded-xl"
                      style={{ 
                        background: 'linear-gradient(135deg, #f2f2f2 0%, #ffffff 100%)', 
                        border: '2px solid #222222'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: '#222222', color: '#ffffff' }}
                        >
                          🎓
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg" style={{ color: '#222222' }}>Certificate of Completion</h4>
                          <p style={{ color: '#6a6a6a', fontSize: '14px' }}>{cert.certificateNumber}</p>
                          <p style={{ color: '#6a6a6a', fontSize: '12px', marginTop: '4px' }}>
                            Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12" style={{ color: '#6a6a6a' }}>
                    No certificates yet. Complete all quizzes in a course to earn a certificate!
                  </div>
                )}
              </div>
            )}

            {activeTab === "rewards" && (
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#222222' }}>My Fee Reductions</h3>
                {achievements?.feeReductions?.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.feeReductions.map((reduction) => (
                      <div key={reduction._id} className="p-4 flex justify-between items-center" style={cardStyle}>
                        <div>
                          <div className="font-semibold text-lg" style={{ color: '#222222' }}>{reduction.discountPercentage}% Discount</div>
                          <div style={{ color: '#6a6a6a', fontSize: '14px' }}>{reduction.reason}</div>
                        </div>
                        <button 
                          className="px-4 py-2 rounded-lg"
                          style={{ backgroundColor: '#222222', color: '#ffffff', fontWeight: 500 }}
                        >
                          Use Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" style={{ color: '#6a6a6a' }}>
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