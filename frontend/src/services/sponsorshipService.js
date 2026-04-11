import api from "./api";

export const getActivePrograms = async () => {
  const response = await api.get("/sponsorship/programs");
  return response.data;
};

export const applyForSponsorship = async (formData) => {
  const response = await api.post("/sponsorship/applications", formData);
  return response.data;
};

export const redeemSponsorshipCode = async (formData) => {
  const response = await api.post("/sponsorship/redeem", formData);
  return response.data;
};

export const createSupportTicket = async (formData) => {
  const response = await api.post("/tickets", formData);
  return response.data;
};

export const getMyTickets = async () => {
  const response = await api.get("/tickets/my");
  return response.data;
};

export const createPaymentIntent = async (formData) => {
  const response = await api.post("/payments/intent", formData);
  return response.data;
};