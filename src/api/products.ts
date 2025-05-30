// مثال على إضافة منتج
import api from "../lib/axios";

type Product = {
  name: string;
  buyPrice: number;
  sellPrice: number;
  unit: string;
  quantity: number;
  category: string;
  discount?: number;
};

export async function addProduct(product: Product) {
  const response = await api.post("/addProduct", product);
  return response.data;
}

export async function updateProduct(product: Product) {
  const response = await api.post("/updateProduct", product);
  return response.data;
}

export async function getAllProducts() {
  const response = await api.get("/getAllProducts");
  return response.data;
}
