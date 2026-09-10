import API from "../utils/axios.js";

const BASE = "/certificates";

export const getTemplates = () => API.get(`${BASE}/templates`);
export const createTemplate = (data) => API.post(`${BASE}/templates`, data);
export const updateTemplate = (id, data) => API.put(`${BASE}/templates/${id}`, data);
export const deleteTemplate = (id) => API.delete(`${BASE}/templates/${id}`);
export const toggleTemplateStatus = (id) => API.patch(`${BASE}/templates/${id}/status`);
export const duplicateTemplate = (id) => API.post(`${BASE}/templates/${id}/duplicate`);

export const issueCertificate = (data) => API.post(`${BASE}/issue`, data);
export const getIssuedCertificates = () => API.get(`${BASE}/issued`);
export const revokeCertificate = (id, reason) => API.patch(`${BASE}/issued/${id}/revoke`, { reason });
