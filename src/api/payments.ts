import api from "../lib/axios";

export async function deletePayment({
  paymentDate,
  paymentId,
  paymentValue,
  customerId,
}: any) {
  const response = await api.delete("/deletePayment", {
    data: {
      paymentDate,
      paymentId,
      paymentValue,
      customerId,
    },
  });

  return response.data;
}
