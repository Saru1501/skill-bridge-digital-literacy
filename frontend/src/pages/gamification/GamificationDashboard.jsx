import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGamification } from "../../context/GamificationContext";

export default function GamificationDashboard() {
  const { fetchAchievements, achievements, loading } = useGamification();
  const [tab, setTab] = useState("overview");

  useEffect(() => { fetchAchievements(); }, []);

  const tabs = [
    { id:"overview",     label:"Overview" },
    { id:"badges",       label:"Badges" },
    { id:"certificates", label:"Certificates" },
    { id:"rewards",      label:"Fee Reductions" },
  ];

  return (
    <div>
      <div className="section-header" style={{marginBottom:28}}>
        <div>
          <h1 className="section-title">My Achievements</h1>
          <p className="section-sub">Points, badges, certificates and fee reductions.</p>
        </div>
        <Link to="/student/leaderboard" className="btn btn-primary">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          View Leaderboard
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{marginBottom:28}}>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{achievements?.totalPoints || 0}</div><div className="stat-label">Total Points</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{achievements?.badges?.length || 0}</div><div className="stat-label">Badges Earned</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{achievements?.certificates?.length || 0}</div><div className="stat-label">Certificates</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div className="stat-info"><div className="stat-value">{achievements?.feeReductions?.length || 0}</div><div className="stat-label">Fee Reductions</div></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar" style={{marginBottom:20}}>
        {tabs.map(t => (
          <button key={t.id} className={"tab-btn"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {loading ? <div className="page-loading"><div className="spinner"></div></div> : (
        <>
          {/* Overview */}
          {tab==="overview" && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:20}}>
              <div className="card">
                <div className="card-header"><h3 className="card-title">Recent Activity</h3></div>
                <div className="card-body">
                  {achievements?.pointsHistory?.length > 0 ? (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {achievements.pointsHistory.slice(0,6).map((item,i) => (
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#F8FAFC",borderRadius:8,border:"1px solid #E2E8F0"}}>
                          <div>
                            <div style={{fontWeight:600,fontSize:13,color:"#0F172A"}}>{item.description}</div>
                            <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{new Date(item.earnedAt).toLocaleDateString()}</div>
                          </div>
                          <span className="badge badge-yellow" style={{fontSize:13}}>+{item.points} pts</span>
                        </div>
                      ))}
                    </div>
                  ) : <div className="empty-state" style={{padding:30}}><p>Complete courses to earn points!</p></div>}
                </div>
              </div>
              <div className="card">
                <div className="card-header"><h3 className="card-title">Fee Reduction Rewards</h3></div>
                <div className="card-body">
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[{pts:100,pct:"10%"},{pts:300,pct:"20%"},{pts:600,pct:"30%"},{pts:1000,pct:"50%"}].map((r,i)=>{
                      const earned = (achievements?.totalPoints||0) >= r.pts;
                      return (
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:earned?"#F0FDF4":"#F8FAFC",borderRadius:8,border:`1px solid ${earned?"#86EFAC":"#E2E8F0"}`}}>
                          <div>
                            <div style={{fontWeight:600,color:"#0F172A"}}>{r.pct} Discount</div>
                            <div style={{fontSize:12,color:"#94A3B8"}}>{r.pts} points required</div>
                          </div>
                          <span className={"badge "+(earned?"badge-green":"badge-gray")}>{earned?"Unlocked":"Locked"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badges */}
          {tab==="badges" && (
            achievements?.badges?.length > 0 ? (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
                {achievements.badges.map((ub,i) => (
                  <div key={i} className="card" style={{padding:24,textAlign:"center"}}>
                    <div style={{width:70,height:70,margin:"0 auto 14px",background:"#EDE9FE",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
                      {ub.badge?.icon || "🏆"}
                    </div>
                    <h4 style={{fontWeight:700,fontSize:15,marginBottom:4}}>{ub.badge?.name}</h4>
                    <p style={{fontSize:12,color:"#64748B",marginBottom:8}}>{ub.badge?.description}</p>
                    <span className="badge badge-purple">{new Date(ub.earnedAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card"><div className="empty-state">
                <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg></div>
                <h3>No badges yet</h3><p>Complete courses and quizzes to earn badges!</p>
              </div></div>
            )
          )}

          {/* Certificates */}
          {tab==="certificates" && (
            achievements?.certificates?.length > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {achievements.certificates.map((cert,i) => (
                  <div key={i} className="card" style={{padding:20,display:"flex",alignItems:"center",gap:20,background:"#F0FDF4",border:"1px solid #86EFAC"}}>
                    <div style={{width:56,height:56,background:"#16A34A",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🎓</div>
                    <div style={{flex:1}}>
                      <h4 style={{fontWeight:700,fontSize:16,marginBottom:4,color:"#0F172A"}}>Certificate of Completion</h4>
                      <p style={{fontSize:13,color:"#64748B",fontFamily:"monospace"}}>{cert.certificateNumber}</p>
                      <p style={{fontSize:12,color:"#94A3B8",marginTop:4}}>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="badge badge-green">Verified</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card"><div className="empty-state">
                <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
                <h3>No certificates yet</h3><p>Complete all lessons in a course to earn your certificate!</p>
              </div></div>
            )
          )}

          {/* Rewards */}
          {tab==="rewards" && (
            achievements?.feeReductions?.length > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {achievements.feeReductions.map((r,i) => (
                  <div key={i} className="card" style={{padding:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:18,fontWeight:700,color:"#0F172A"}}>{r.discountPercentage}% Discount</div>
                      <div style={{fontSize:13,color:"#64748B",marginTop:2}}>{r.reason}</div>
                    </div>
                    <span className={"badge "+(r.isUsed?"badge-gray":"badge-green")}>{r.isUsed?"Used":"Available"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card"><div className="empty-state">
                <div className="empty-state-icon"><svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                <h3>No fee reductions yet</h3><p>Earn 100+ points to unlock your first discount!</p>
              </div></div>
            )
          )}
        </>
      )}
    </div>
  );
}
