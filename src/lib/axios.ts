import axios from "axios";

const api = axios.create({
  baseURL: "https://inventoryserver-krjr.onrender.com", // ✨ غيّر هذا إلى رابط السيرفر الخاص بك
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // إذا كنت تتعامل مع cookies أو sessions
});

export default api;
