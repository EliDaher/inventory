import api from "../lib/axios";

export async function deleteInoive({
  invoiceDate,
  invoiceId,
  invoiceValue,
  customerId,
}: any) {
  const response = await api.delete("/deleteInvoice", {
    data: {
      invoiceDate,
      invoiceId,
      invoiceValue,
      customerId,
    },
  });

  return response.data;
}
