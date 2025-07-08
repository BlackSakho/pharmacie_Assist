import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (userData: {
  nom: string;
  email: string;
  password: string;
  role: string; // "admin" ou "pharmacien"
}) => api.post("/auth/register", userData);

// Pharmacies
export const getPharmacies = () => api.get("/pharmacies/garde");
export const getPharmaciesProches = (
  lat: number,
  lng: number,
  maxDistance = 5000
) => api.get("/pharmacies/proches", { params: { lat, lng, maxDistance } });
export const getPharmacy = (id: string) => api.get(`/pharmacies/${id}`);
export const createPharmacy = (data: {
  nom: string;
  adresse: string;
  localisation: string;
  horaires: string;
  email: string;
  telephone: string;
  coordonnees: {
    type: "Point";
    coordinates: [number, number];
  };
}) => api.post("/pharmacies", data);
export const updatePharmacy = (id: string, data: any) =>
  api.put(`/pharmacies/${id}`, data);
export const deletePharmacy = (id: string) => api.delete(`/pharmacies/${id}`);
export const getAllPharmacies = () => api.get("/pharmacies");

// Médicaments
export const searchMedications = (nom: string) =>
  api.get("/medicaments/search", { params: { nom } });
export const getMedications = () => api.get("/medicaments");
export const getMedication = (id: string) => api.get(`/medicaments/${id}`);
export const createMedication = (data: {
  nom: string;
  description: string;
  disponibilites: Array<{
    pharmacieId: string;
    prix: number;
    disponible: boolean;
  }>;
}) => api.post("/medicaments", data);
export const createMedicationWithPhoto = (formData: FormData) =>
  api.post("/medicaments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateMedication = (id: string, data: any) =>
  api.put(`/medicaments/${id}`, data);
export const deleteMedication = (id: string) =>
  api.delete(`/medicaments/${id}`);

// Duty Schedules
export const getDutySchedules = () => api.get("/gardes");
export const getDutySchedule = (id: string) => api.get(`/gardes/${id}`);
export const createDutySchedule = (data: {
  pharmacieId: string;
  date: string;
  heure_debut: string;
  heure_fin: string;
}) => api.post("/gardes", data);
export const updateDutySchedule = (id: string, data: any) =>
  api.put(`/gardes/${id}`, data);
export const deleteDutySchedule = (id: string) => api.delete(`/gardes/${id}`);

// Users
export const getUsers = () => api.get("/users");
export const getUser = (id: string) => api.get(`/users/${id}`);
export const createUser = (data: {
  nom: string;
  email: string;
  password: string;
  role: string;
  
}) => api.post("/users", data);
export const updateUser = (id: string, data: any) =>
  api.put(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
export const toggleBlockUser = (id: string) => api.patch(`/users/${id}/block`);

// IA Santé
export const getHealthAdvice = (question: string) =>
  api.post("/ia/conseils-sante", { question });

export const getMedicationsByPharmacie = () =>
  api.get("/medicaments/by-pharmacie");




export default api;
