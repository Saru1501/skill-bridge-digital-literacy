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
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 shadow-lg text-left text-white animate-fade-in relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Code Validated Successfully!</h3>
            </div>

            <p className="text-indigo-100 text-lg mb-6 max-w-lg">
              Congratulations! Your sponsorship code has been accepted. You are now officially enrolled and eligible for financial support under the following program:
            </p>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 mb-6">
              <p className="text-sm text-indigo-200 uppercase tracking-wider font-semibold mb-1">Sponsored Program</p>
              <p className="text-xl font-bold">{redeemedData.program?.title || "Unknown Program"}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-medium text-indigo-100 opacity-80">Code Reference:</span>
                <code className="bg-black/30 px-2 py-1 rounded text-sm font-mono">{redeemedData.sponsorshipCode}</code>
              </div>
            </div>

            <button 
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold shadow-md hover:bg-gray-50 transition-all active:scale-95"
              onClick={() => window.location.href = '/student/payment'}
            >
              Continue to Payment / Enrollment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}