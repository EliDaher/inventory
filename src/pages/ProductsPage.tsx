import Table from "../component/UI/Table";
import ThemeToggle from "../component/ThemeToggle";
import Button from "../component/UI/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/products";

// أعمدة جدول المنتجات
const columns = ["الاسم", "السعر شراء", "السعر بيع", "الكمية", "القسم", "الخصم"];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);

  const getProducts = async () => {
    try {
      const result = await getAllProducts();
      console.log("البيانات الخام:", result.productsData);

      // تحويل object إلى array
      const productsArray = Object.keys(result.productsData).map((key) => {
        return {
          id: key,
          ...result.productsData[key],
        };
      });

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

      <Table
        columns={columns}
        data={data.map((prod) => ({
          "الاسم": prod.name,
          "السعر شراء": prod.buyPrice,
          "السعر بيع": prod.sellPrice,
          "الكمية": prod.quantity,
          "القسم": prod.category,
          "الخصم": prod.discount || 0,
        }))}
        onRowClick={(row) => {
          console.log("تم النقر على الصف:", row["الاسم"]);
        }}
      />

      <ThemeToggle />
    </div>
  );
}
