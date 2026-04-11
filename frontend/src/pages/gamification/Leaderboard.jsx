import { useEffect, useState } from "react";
import { gamificationService } from "../../services/gamificationService";
import Navbar from "../../components/Navbar";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
    return `#${rank}`;
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px'
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #ffd700 0%, #ffb700 100%)', color: '#222222' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)', color: '#222222' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #cd7f32 0%, #b87333 100%)', color: '#222222' };
    return { backgroundColor: '#f2f2f2', color: '#222222' };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <Navbar />

      <div className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: '#222222', letterSpacing: '-0.18px' }}>
          🏆 Leaderboard
        </h2>

        {myRank && (
          <div 
            className="p-6 mb-6 text-center"
            style={{ 
              background: 'linear-gradient(135deg, #ff385c 0%, #e00b41 100%)',
              borderRadius: '20px',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Your Current Rank</div>
            <div className="text-5xl font-bold mt-2">#{myRank.rank || "-"}</div>
            <div className="mt-2" style={{ opacity: 0.8 }}>{myRank.totalPoints} points</div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8" style={{ color: '#6a6a6a' }}>Loading...</div>
        ) : (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            {leaderboard.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center p-4"
                style={{ 
                  borderBottom: '1px solid #f2f2f2',
                  ...getRankStyle(entry.rank)
                }}
              >
                <div className="w-12 text-center text-xl font-bold">{getRankBadge(entry.rank)}</div>
                <div className="flex-1 ml-4">
                  <div className="font-semibold" style={{ fontSize: '14px' }}>{entry.student?.name || "Unknown"}</div>
                  <div style={{ fontSize: '12px', color: '#6a6a6a' }}>{entry.student?.email}</div>
                </div>
                <div className="text-xl font-bold" style={{ color: '#ff385c' }}>{entry.totalPoints}</div>
              </div>
            ))}
          </div>
        )}

        {leaderboard.length === 0 && !loading && (
          <div className="text-center py-12" style={{ color: '#6a6a6a' }}>
            No users on the leaderboard yet.
          </div>
        )}
      </div>
    </div>
  );
}