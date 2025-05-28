// مثال على إضافة منتج
import api from "../lib/axios";

type dealer = {
    name: string;
    phoneNumber?: string;
};

export async function addDealer(dealer: dealer) {
  const response = await api.post("/addDealer", dealer);
  return response.data;
}

export async function getDealers() {
  const response = await api.get("/getDealers");
  return response.data;
}

export async function addDealerInvoicePayment(newInvoice: any) {
  const response = await api.post("/addDealerInvoicePayment", newInvoice);
  return response.data;
}
