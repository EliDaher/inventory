import Table from "../component/UI/Table";
import ThemeToggle from "../component/ThemeToggle";
import Button from "../component/UI/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";
import EndSell from "../component/EndSell";


export default function ProductsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  
  const [isOpen, setisOpen] = useState(false);

  // تعريف الأعمدة مع إمكانية تخصيص العمود الأول (بيع)
  const columns = [
    {
      header: "بيع",
      accessor: "بيع",
      render: (row: any) => (
        <input
          type="checkbox"
          className="w-5 h-5 accent-primary cursor-pointer"
          checked={isRowSelected(row)}
          onChange={() => toggleRowSelection(row)}
          onClick={(e) => e.stopPropagation()}
        />

      ),
    },
    { header: "الاسم", accessor: "الاسم" },
    { header: "السعر شراء", accessor: "السعر شراء" },
    { header: "السعر بيع", accessor: "السعر بيع" },
    { header: "الكمية", accessor: "الكمية" },
    { header: "القسم", accessor: "القسم" },
    { header: "الواحدة", accessor: "الواحدة" },
  ];

  
  const isRowSelected = (row: any) => {
    return selectedRows.some((r) => JSON.stringify(r) === JSON.stringify(row));
  };

  
  const toggleRowSelection = (row: any) => {
    setSelectedRows((prev) => {
      const isSelected = isRowSelected(row);
      if (isSelected) {
        return prev.filter((r) => JSON.stringify(r) !== JSON.stringify(row));
      } else {
        return [...prev, row];
      }
    });
  };

  const getProducts = async () => {
    try {
      const result = await getAllProducts();

      const productsArray = Object.keys(result.productsData).map((key) => ({
        id: key,
        ...result.productsData[key],
      }));

      setData(productsArray);
    } catch (error: any) {
      console.error("❌ خطأ في جلب المنتجات:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  

  return (
    <div className="p-6 bg-background dark:bg-dark-background">

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-dark-background p-6 rounded-xl shadow-xl relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند الضغط داخل المحتوى
          >
            {/* زر الإغلاق */}
            <button
              className="absolute top-2 left-2 text-xl text-gray-500 hover:text-red-500"
              onClick={() => setisOpen(false)}
            >
              ✕
            </button>

            {/* محتوى EndSell */}
            <EndSell selectedRows={selectedRows} onClose={() => setisOpen(false)} />
          </div>
        </div>
      )}


      <div className="flex flex-row-reverse items-center justify-between mb-2">
        <h1 className="text-text dark:text-dark-text text-2xl text-right font-cairo">المنتجات</h1>
        <Button
          onClick={() => {
            navigate("/addProduct");
          }}
          className="bg-accent/90 dark:bg-dark-accent hover:bg-accent-hover dark:hover:bg-dark-accent-hover"
        >
          اضافة منتج
        </Button>
      </div>

      {selectedRows.length !== 0 && (
        <div className="dark:text-dark-text text-text p-2 my-4 rounded-xl flex gap-5 bg-background/10 shadow items-center justify-center">
          المنتجات المختارة <div>{selectedRows.length}</div>
          <div className="overflow-x-hidden">
            <div className="flex flex-row overflow-x-auto h-12 whitespace-nowrap">
              {selectedRows.map((row, index) => (
                <span key={index} className="mr-2">
                  {row.الاسم}
                  {index < selectedRows.length - 1 && " / "}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={()=>{
              setisOpen(true)
            }}
            className="bg-accent hover:bg-accent-hover dark:bg-accent dark:hover:bg-accent-hover"
          >
            اتمام عملية البيع
          </Button>
        </div>
      )}

      <Table
        columns={columns}
        data={data.map((prod) => ({
          id: prod.id, // هذا يتم الاحتفاظ به في الكائن ولكن لن يظهر في الأعمدة
          "بيع": "", // محتوى الحقل غير مهم لأنه سيتم تجاوزه بواسطة render
          "الاسم": prod.name,
          "السعر شراء": prod.buyPrice,
          "السعر بيع": prod.sellPrice,
          "الكمية": prod.quantity,
          "الواحدة": prod.unit,
          "القسم": prod.category,
        }))}
        onRowClick={(row) => {
          navigate("/ProductDetails", {
            state: row,
          });
        }}
      />

      <ThemeToggle />
    </div>
  );
}
