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

export const createProgram = async (formData) => {
  const response = await api.post("/sponsorship/programs", formData);
  return response.data;
};

export const getNgoApplications = async () => {
  const response = await api.get("/sponsorship/applications");
  return response.data;
};

export const reviewApplication = async (applicationId, formData) => {
  const response = await api.put(
    `/sponsorship/applications/${applicationId}/status`,
    formData
  );
  return response.data;
};

export const deleteProgram = async (programId) => {
  const response = await api.delete(`/sponsorship/programs/${programId}`);
  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const updateTicketStatus = async (ticketId, formData) => {
  const response = await api.put(`/tickets/${ticketId}/status`, formData);
  return response.data;
};