import { useState } from "react";
import { redeemSponsorshipCode } from "../services/sponsorshipService";

export default function StudentRedeemPage() {
  const [formData, setFormData] = useState({
    sponsorshipCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redeemedData, setRedeemedData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      sponsorshipCode: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setRedeemedData(null);

    if (!formData.sponsorshipCode.trim()) {
      setError("Please enter a sponsorship code.");
      return;
    }

    try {
      setLoading(true);
      const data = await redeemSponsorshipCode(formData);
      setSuccess(data.message || "Sponsorship code redeemed successfully.");
      setRedeemedData(data);
      setFormData({ sponsorshipCode: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to redeem sponsorship code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Redeem Sponsorship Code</h2>
        <p className="mt-2 text-gray-600">
          Enter your approved sponsorship code to validate it and unlock sponsorship support.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sponsorship Code
            </label>
            <input
              type="text"
              name="sponsorshipCode"
              value={formData.sponsorshipCode}
              onChange={handleChange}
              placeholder="Enter your sponsorship code"
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Validating..." : "Redeem Code"}
          </button>
        </form>
      </div>

      {redeemedData && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Redeemed Sponsorship Details</h3>

          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">Status:</span>{" "}
              {redeemedData.valid ? "Valid" : "Invalid"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Program:</span>{" "}
              {redeemedData.program?.title || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Sponsorship Code:</span>{" "}
              {redeemedData.sponsorshipCode || "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}