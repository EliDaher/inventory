// مثال على إضافة منتج
import api from "../lib/axios";

type customer = {
    name: string;
    phoneNumber?: string;
};

export async function addCustomer(customer: customer) {
  const response = await api.post("/addCustomer", customer);
  return response.data;
}

export async function getCustomers() {
  const response = await api.get("/getCustomers");
  return response.data;
}

export async function addCustomerInvoicePayment(newInvoice: any) {
  const response = await api.post("/addCustomerInvoicePayment", newInvoice);
  return response.data;
}
