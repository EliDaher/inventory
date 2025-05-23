// مثال على إضافة منتج
import api from "../lib/axios";

type category = {
    name: string;
};

export async function addCategory(category: category) {
  const response = await api.post("/addCategory", category);
  return response.data;
}

export async function getCategory() {
  const response = await api.get("/getCategory");
  return response.data;
}
