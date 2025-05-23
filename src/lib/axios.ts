import axios from "axios";

const api = axios.create({
  baseURL: "https://inventoryserver-krjr.onrender.com", // ✨ غيّر هذا إلى رابط السيرفر الخاص بك
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
