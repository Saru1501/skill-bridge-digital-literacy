import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gamificationService } from "../../services/gamificationService";
import { useAuth } from "../../context/AuthContext";

export default function Leaderboard() {
  const { user } = useAuth();
  const [board,   setBoard]   = useState([]);
  const [myRank,  setMyRank]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [lb, rank] = await Promise.all([
          gamificationService.getLeaderboard(20),
          gamificationService.getMyRank(),
        ]);
        setBoard(lb.data.data || []);
        setMyRank(rank.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const medal = (r) => r===1?"🥇":r===2?"🥈":r===3?"🥉":null;

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="section-header" style={{marginBottom:24}}>
        <div>
          <h1 className="section-title">Leaderboard</h1>
          <p className="section-sub">Top learners ranked by total points earned.</p>
        </div>
        <Link to="/student/gamification" className="btn btn-secondary">My Achievements</Link>
      </div>

      {/* My rank card */}
      {myRank && (
        <div className="card" style={{marginBottom:20,background:"linear-gradient(135deg,#0F172A,#1E3A5F)",border:"none"}}>
          <div className="card-body" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 28px"}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:18}}>
                #{myRank?.rank || "–"}
              </div>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontSize:16}}>Your Ranking</div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>{user?.name}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:"#FCD34D",fontWeight:800,fontSize:28}}>{myRank?.totalPoints || 0}</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>Total Points</div>
            </div>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th style={{width:60}}>Rank</th><th>Student</th><th>Points</th><th>Badges</th><th>Courses</th></tr>
          </thead>
          <tbody>
            {board.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:"center",color:"#94A3B8",padding:40}}>No data yet. Complete courses to appear here!</td></tr>
            )}
            {board.map((entry, i) => {
              const rank = i + 1;
              const isMe = entry.student?._id === user?._id;
              return (
                <tr key={i} style={isMe?{background:"#EFF6FF"}:{}}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:"50%",
                      background:rank<=3?"#FEF3C7":"#F1F5F9",fontWeight:700,fontSize:rank<=3?20:14,color:rank<=3?"#D97706":"#64748B"}}>
                      {medal(rank) || rank}
                    </div>
                  </td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,flexShrink:0}}>
                        {entry.student?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div style={{fontWeight:600}}>{entry.student?.name || "Anonymous"}</div>
                        {isMe && <div style={{fontSize:11,color:"#2563EB",fontWeight:600}}>You</div>}
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-yellow" style={{fontSize:13}}>{entry.totalPoints || 0} pts</span></td>
                  <td style={{color:"#64748B"}}>{entry.badgeCount || 0}</td>
                  <td style={{color:"#64748B"}}>{entry.courseCount || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
