import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gamificationService } from "../../services/gamificationService";
import useAuth from "../../hooks/useAuth";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
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
      const [lbRes, rankRes] = await Promise.all([
        gamificationService.getLeaderboard(20),
        gamificationService.getMyRank(),
      ]);
      setLeaderboard(lbRes.data.data || []);
      setMyRank(rankRes.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return { backgroundColor: '#fff5f5', border: '2px solid #e60023' };
    if (rank === 2) return { backgroundColor: '#f6f6f3' };
    if (rank === 3) return { backgroundColor: '#fff8f0' };
    return { backgroundColor: 'white' };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f6f3' }}>
      <nav className="nav-glass">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/student" style={{ fontSize: '20px', fontWeight: 700, color: '#ff385c' }}>SkillBridge</Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/student" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Home</Link>
              <Link to="/student/gamification" style={{ padding: '8px 16px', borderRadius: '20px', color: '#211922', fontWeight: 500, fontSize: '14px' }}>Activity</Link>
              <Link to="/student/leaderboard" style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#e5e5e0', color: '#211922', fontWeight: 600, fontSize: '14px' }}>Leaderboard</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#62625b', fontSize: '14px' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '32px 16px', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 600, textAlign: 'center', marginBottom: '24px' }}>🏆 Leaderboard</h2>

        {myRank && (
          <div className="card" style={{ textAlign: 'center', padding: '32px', marginBottom: '24px', backgroundColor: '#e60023', color: 'white' }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Your Current Rank</div>
            <div style={{ fontSize: '56px', fontWeight: 700 }}>#{myRank.rank || "-"}</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>{myRank.totalPoints} points</div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#62625b' }}>Loading...</div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            {leaderboard.map((entry) => (
              <div
                key={entry._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  borderBottom: '1px solid #e5e5e0',
                  ...getRankStyle(entry.rank),
                }}
              >
                <div style={{ width: '48px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }}>{getRankBadge(entry.rank)}</div>
                <div style={{ flex: 1, marginLeft: '16px' }}>
                  <div style={{ fontWeight: 600, color: '#211922' }}>{entry.student?.name || "Unknown"}</div>
                  <div style={{ fontSize: '13px', color: '#62625b' }}>{entry.student?.email}</div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#e60023' }}>{entry.totalPoints}</div>
              </div>
            ))}
          </div>
        )}

        {leaderboard.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#62625b' }}>
            No users on the leaderboard yet.
          </div>
        )}
      </div>
    </div>
  );
}