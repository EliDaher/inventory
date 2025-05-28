import { useEffect, useState } from "react";
import Table from "../component/UI/Table";
import Input from "./UI/Input";
import Button from "./UI/Button";
import SelectBuyer from "./SelectBuyer";
import { addCustomerInvoicePayment, getCustomers } from "../api/customer";
import pdfMake from "pdfmake/build/pdfmake";
import AmiriCode from "../font/Amiri";
import AmiriBold from "../font/AmiriBold";
// استخدم as any لتفادي TypeScript error

(pdfMake as any).vfs = {
  "Amiri-Regular.ttf": `${AmiriCode}`,
  "Amiri-Bold.ttf": `${AmiriBold}`
};

// تسجيل الخط
(pdfMake as any).fonts = {
  Amiri: {
    normal: "Amiri-Regular.ttf",
    bold: "Amiri-Bold.ttf",
  }
};


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

  const reverseArabic = (text: string) => {
    return text.split(' ').reverse().join('  ');
  };

  
  const generatePDF = () => {
    const invoiceDate = new Date();
    const formattedDate = invoiceDate.toLocaleDateString();
    const formattedTime = invoiceDate.toLocaleTimeString();

    const customer: any = customerArr.find((c: any) => c.id === customerName);

    const tableBody = [
      [
        { text: "الإجمالي", style: "tableHeader" },
        { text: "الواحدة", style: "tableHeader" },
        { text: "الكمية", style: "tableHeader" },
        { text: "السعر", style: "tableHeader" },
        { text: "المنتج", style: "tableHeader" },
      ],
      ...selectedRows.map((row: any) => {
        const key = row.id || row["الاسم"] || row.name;
        const quantity = quantities[key] || 0;
        const price = row["السعر بيع"];
        const total = quantity * price;
        return [
          { text: total.toFixed(2), alignment: "right" },
          { text: row["الواحدة"], alignment: "right" },
          { text: quantity, alignment: "right" },
          { text: price.toFixed(2), alignment: "right" },
          { text: reverseArabic(row["الاسم"]), alignment: "right"  },
        ];
      }),
    ];

    const docDefinition: any = {
      content: [
        { text: "Basel & Akram Store", style: "header" },
        {
          text: `${formattedDate} : التاريخ  -  ${formattedTime} : الساعة`,
          alignment: "right",
          margin: [0, 5, 0, 15],
          style: "subheader",
        },
        {
          text: `${customer ? `${customer.name} - ${customer.customerNumber} : للسيد  مبيعات  فاتورة` : ""}`,
          alignment: "right",
          margin: [0, 0, 0, 15],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            widths: ["*", "auto"],
            body: [
              [
                { text: "" },
                {
                  stack: [
                    { text: `${total.toFixed(2)} $ : الإجمالي`, alignment: "right", margin: [0, 5, 0, 5] },
                    { text: `${discount.toFixed(2)} $ : الحسم`, alignment: "right", margin: [0, 0, 0, 5] },
                    { text: `${(total - discount).toFixed(2)} $  : المطلوب المبلغ`, alignment: "right", bold: true },
                  ],
                },
              ],
            ],
          },
          layout: "noBorders",
        },
      ],
      defaultStyle: {
        font: "Amiri",
        fontSize: 12,
        alignment: "right",  // النص افتراضي إلى اليمين
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        subheader: {
          fontSize: 14,
        },
        tableHeader: {
          fillColor: "#eeeeee",
          bold: true,
          fontSize: 13,
          alignment: "center",
        },
      },
      pageMargins: [40, 60, 40, 60],
      // direction: 'rtl'  // pdfMake لا يدعم خاصية direction لكن المحاذات كافية
    };

    pdfMake.createPdf(docDefinition).download(`فاتورة-${formattedDate}-${formattedTime}/ ${customer.name}.pdf`);
  };




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
    generatePDF()
    onClose();
  };

  if (isOpen) {
    return (
      <SelectBuyer
        setCustomer={setCustomerName}
        setisOpen={setisOpen}
        customerArr={customerArr}
        getCust={getCust}
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
