import { createContext, useContext, useState, useEffect } from "react";
import { gamificationService } from "../services/gamificationService";

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({ children }) => {
  const [points, setPoints] = useState(null);
  const [badges, setBadges] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [feeReductions, setFeeReductions] = useState([]);
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMyPoints = async () => {
    try {
      const res = await gamificationService.getMyPoints();
      setPoints(res.data.data);
    } catch (err) {
      console.error("Error fetching points:", err);
    }
  };

  const fetchMyBadges = async () => {
    try {
      const res = await gamificationService.getMyBadges();
      setBadges(res.data.data);
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  };

  const fetchMyCertificates = async () => {
    try {
      const res = await gamificationService.getMyCertificates();
      setCertificates(res.data.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    }
  };

  const fetchLeaderboard = async (limit = 10) => {
    try {
      const res = await gamificationService.getLeaderboard(limit);
      setLeaderboard(res.data.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const fetchMyRank = async () => {
    try {
      const res = await gamificationService.getMyRank();
      setMyRank(res.data);
    } catch (err) {
      console.error("Error fetching rank:", err);
    }
  };

  const fetchMyFeeReductions = async () => {
    try {
      const res = await gamificationService.getMyFeeReductions();
      setFeeReductions(res.data.data);
    } catch (err) {
      console.error("Error fetching fee reductions:", err);
    }
  };

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const res = await gamificationService.getAchievementVault();
      setAchievements(res.data.data);
    } catch (err) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    await Promise.all([
      fetchMyPoints(),
      fetchMyBadges(),
      fetchMyCertificates(),
      fetchLeaderboard(),
      fetchMyRank(),
      fetchMyFeeReductions(),
      fetchAchievements(),
    ]);
  };

  const value = {
    points,
    badges,
    certificates,
    leaderboard,
    myRank,
    feeReductions,
    achievements,
    loading,
    fetchMyPoints,
    fetchMyBadges,
    fetchMyCertificates,
    fetchLeaderboard,
    fetchMyRank,
    fetchMyFeeReductions,
    fetchAchievements,
    fetchAll,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};