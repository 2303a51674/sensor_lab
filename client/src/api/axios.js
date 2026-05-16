import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: log to confirm it's loaded (remove later if you want)
console.log("API BASE URL:", process.env.REACT_APP_API_URL);

export default api;
