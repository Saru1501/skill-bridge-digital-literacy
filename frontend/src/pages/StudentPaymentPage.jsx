import { useState } from "react";
import { createPaymentIntent } from "../services/sponsorshipService";

export default function StudentPaymentPage() {
  const [formData, setFormData] = useState({
    amountLKR: "",
    purpose: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPaymentData(null);

    if (!formData.amountLKR || !formData.purpose.trim()) {
      setError("Amount and purpose are required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        amountLKR: Number(formData.amountLKR),
        purpose: formData.purpose,
      };

      const data = await createPaymentIntent(payload);

      setSuccess(data.message || "Payment intent created successfully.");
      setPaymentData(data);

      setFormData({
        amountLKR: "",
        purpose: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create payment intent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h2 className="text-2xl font-bold text-gray-900">Payment Intent</h2>
        <p className="mt-2 text-gray-600">
          This page demonstrates Stripe Payment Intent API integration from the frontend.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm text-left">
        <h3 className="text-xl font-semibold text-gray-900">Create Payment Intent</h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount (LKR)
            </label>
            <input
              type="number"
              name="amountLKR"
              value={formData.amountLKR}
              onChange={handleChange}
              placeholder="Enter amount in LKR"
              className="w-full rounded-lg border px-4 py-3"
              min="1"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Purpose
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. course_fee_remainder"
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
            {loading ? "Creating..." : "Create Payment Intent"}
          </button>
        </form>
      </div>

      {paymentData && (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-left border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Payment Intent Response</h3>

          <div className="mt-4 space-y-3 text-sm text-gray-700 break-all">
            <p>
              <span className="font-medium text-gray-900">Payment Intent ID:</span>{" "}
              {paymentData.paymentIntentId || "N/A"}
            </p>

            <p>
              <span className="font-medium text-gray-900">Client Secret:</span>{" "}
              {paymentData.clientSecret || "N/A"}
            </p>

            {paymentData.payment && (
              <>
                <p>
                  <span className="font-medium text-gray-900">Amount:</span>{" "}
                  {paymentData.payment.amountLKR} LKR
                </p>

                <p>
                  <span className="font-medium text-gray-900">Purpose:</span>{" "}
                  {paymentData.payment.purpose}
                </p>

                <p>
                  <span className="font-medium text-gray-900">Status:</span>{" "}
                  {paymentData.payment.status}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}