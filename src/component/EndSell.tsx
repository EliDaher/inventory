import { useEffect, useState } from "react";
import Table from "../component/UI/Table";
import Input from "./UI/Input";
import Button from "./UI/Button";
import SelectBuyer from "./SelectBuyer";
import { addCustomerInvoicePayment, getCustomers } from "../api/customer";

export default function EndSell({ selectedRows, onClose }: any) {
  const [isOpen, setisOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerArr, setCustomerArr] = useState([]);

  const [quantities, setQuantities] = useState(() =>
    selectedRows.reduce((acc: any, row: any) => {
      const key = row.id || row["الاسم"] || row.name;
      acc[key] = row.quantity || 1;
      return acc;
    }, {})
  );

  const handleQuantityChange = (key: string, value: string) => {
    const qty = Math.max(0, Number(value));
    setQuantities((prev: any) => ({ ...prev, [key]: qty }));
  };

  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const newTotal = selectedRows.reduce((sum: number, row: any) => {
      const key = row.id || row["الاسم"] || row.name;
      const qty = quantities[key] ?? 0;
      return sum + qty * row["السعر بيع"];
    }, 0);
    setTotal(newTotal);
  }, [quantities, selectedRows]);

  const columns = [
    { header: "القسم", accessor: "القسم" },
    { header: "الاسم", accessor: "الاسم" },
    { header: "السعر شراء", accessor: "السعر شراء" },
    { header: "السعر بيع", accessor: "السعر بيع" },
    {
      header: "كمية البيع",
      accessor: "كمية البيع",
      render: (row: any) => {
        const key = row.id || row["الاسم"] || row.name;
        return (
          <Input
            type="number"
            min={0}
            value={quantities[key]}
            onChange={(e) => handleQuantityChange(key, e.target.value)}
            className="w-20 no-spinner"
          />
        );
      },
    },
    { header: "الواحدة", accessor: "الواحدة" },
    {
      header: "اجمالي السعر",
      accessor: "اجمالي السعر",
      render: (row: any) => {
        const key = row.id || row["الاسم"] || row.name;
        return (
          <Input
            type="number"
            min={0}
            value={quantities[key] * row["السعر بيع"]}
            readOnly={true}
            className="w-16"
          />
        );
      },
    },
  ];

  const getCust = async () => {
    const res = await getCustomers();
    const tempCustomerArr = Object.values(res.customerData);
    setCustomerArr(tempCustomerArr as any);
  };

  useEffect(() => {
    getCust();
  }, []);

  useEffect(()=>{
    console.log(customerArr)
  },[customerArr])

  const submit = async () => {
    if (!customerName) {
      alert('الرجاء تحديد اسم الزبون');
      return setisOpen(true);
    }

    const confirmed = window.confirm(
      `المجموع النهائي للفاتورة هو ${(Number(total) - Number(discount)).toFixed(2)} دولار على السيد ${customerName}\nهل تريد تأكيد العملية؟`
    );
    if (!confirmed) return;

    const saleData = {
      customerName: customerName,
      discount: Number(discount),
      total: Number(total),
      finalAmount: (Number(total) - Number(discount)).toFixed(2),
      items: selectedRows.map((row: any) => {
        const key = row.id || row["الاسم"] || row.name;
        const quantity = quantities[key] || 0;

        return {
          id: row.id || null,
          name: row["الاسم"] || row.name || "",
          category: row["القسم"] || "",
          unit: row["الواحدة"] || "",
          buyPrice: row["السعر شراء"] || 0,
          sellPrice: row["السعر بيع"] || 0,
          quantity: quantity,
          totalPrice: quantity * row["السعر بيع"],
        };
      }),
      createdAt: new Date().toISOString(),
    };

    console.log("البيانات الجاهزة للإرسال:", saleData);
    const res = await addCustomerInvoicePayment(saleData);
    console.log(res.data)

    alert("تم تنفيذ البيع بنجاح");
    onClose();
    window.location.reload();
  };

  if (isOpen) {
    return (
      <SelectBuyer
        setCustomer={setCustomerName}
        setisOpen={setisOpen}
        customerArr={customerArr}
      />
    );
  }

  return (
    <div className="dark:text-dark-text text-text">
      <h2 className="text-xl font-bold mb-4">اتمام البيع</h2>
      <div className="h-80 overflow-y-auto">
        <Table
          columns={columns}
          data={selectedRows.map((prod: any) => {
            const key = prod.id || prod["الاسم"] || prod.name;
            return {
              id: key,
              "القسم": prod["القسم"],
              "الاسم": prod["الاسم"],
              "السعر شراء": prod["السعر شراء"],
              "السعر بيع": prod["السعر بيع"],
              "كمية البيع": quantities[key] || 0,
              "الواحدة": prod["الواحدة"],
            };
          })}
        />
      </div>

      <div className="flex justify-between items-center mt-5">
        <h2 className="text-center">المجموع :</h2>
        <Input value={total} readOnly={true} />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-center">الحسم :</h2>
        <Input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value) || 0)}
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-center">المبلغ المطلوب :</h2>
        <Input
          value={(Number(total) - Number(discount)).toFixed(2)}
          readOnly={true}
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-center">اسم الزبون :</h2>
        <Button onClick={() => setisOpen(true)}>
          {customerName
          ? (() => {
              const customer: any = customerArr.find((c: any) => c.id === customerName);
              return customer ? `${customer?.name} - ${customer?.customerNumber}` : "اختيار";
            })()
          : "اختيار"}

        </Button>
      </div>

      <div className="flex mt-4 justify-between">
        <Button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 dark:bg-red-500 hover:dark:bg-red-600 text-white px-4 py-2 rounded"
        >
          إغلاق
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 dark:bg-green-500 hover:dark:bg-green-600"
          onClick={submit}
        >
          انهاء العملية
        </Button>
      </div>
    </div>
  );
}
