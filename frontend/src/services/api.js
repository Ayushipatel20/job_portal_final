import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// Auth
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resetPassword = (data) => API.post("/reset-password", data);