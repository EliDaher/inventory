import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../component/UI/Input";
import ThemeToggle from "../component/ThemeToggle";
import Button from "../component/UI/Button";
import Card from "../component/UI/Card";

interface Product {
  id: string;
  الاسم: string;
  الكمية: number;
  القسم: string;
  "السعر شراء": number;
  "السعر بيع": number;
  الواحدة: string;
}

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate()
  const [productData, setProductData] = useState<Product | null>(null);
  const [editedData, setEditedData] = useState<Product | null>(null);

  useEffect(() => {
    if (location.state) {
      const data = location.state as Product;
      setProductData(data);
      setEditedData(data);
    }
  }, [location.state]);


  const formatForFirebase = (data: Product) => {
    return {
      id: data.id,
      name: data.الاسم,
      buyPrice: data["السعر شراء"],
      sellPrice: data["السعر بيع"],
      category: data.القسم,
      quantity: data.الكمية,
      unit: data.الواحدة,
    };
  };

  const handleSaveEdit = () => {
    if (!editedData) return;
    setProductData(editedData);
    console.log(formatForFirebase(editedData))
    navigate('/products')
    alert("✅ تم حفظ التعديلات بنجاح");
  };

  const handleCancelEdit = () => {
    setEditedData(productData);
    navigate('/products')
  };

  const handleEditChange = (field: keyof Product, value: string | number) => {
    if (!editedData) return;
    setEditedData({ ...editedData, [field]: value });
  };

  if (!productData)
    return <div className="p-4 text-gray-500">لا يوجد بيانات لعرضها.</div>;

  return (
    <Card className="mx-auto p-6 max-w-2xl mt-10 mb-5 bg-dark-background/5 dark:bg-background/5 shadow-xl rounded-2xl text-text dark:text-dark-text">
      <h2 className="text-3xl font-bold text-center mb-6">
        {productData.الاسم}
      </h2>
        <div className="space-y-4">
          <Input
            label="الاسم"
            value={editedData?.الاسم}
            onChange={(e) => handleEditChange("الاسم", e.target.value)}
          />
          <Input
            label="الكمية"
            type="number"
            value={editedData?.الكمية}
            onChange={(e) => handleEditChange("الكمية", +e.target.value)}
          />
          <Input
            label="القسم"
            value={editedData?.القسم}
            onChange={(e) => handleEditChange("القسم", e.target.value)}
          />
          <Input
            label="سعر الشراء"
            type="number"
            value={editedData?.["السعر شراء"]}
            onChange={(e) => handleEditChange("السعر شراء", +e.target.value)}
          />
          <Input
            label="سعر البيع"
            type="number"
            value={editedData?.["السعر بيع"]}
            onChange={(e) => handleEditChange("السعر بيع", +e.target.value)}
          />
          <Input
            label="الواحدة"
            value={editedData?.الواحدة}
            onChange={(e) => handleEditChange("الواحدة", e.target.value)}
          />

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 hover:dark:bg-blue-700 text-white px-4 py-2 rounded"
            >
              💾 حفظ
            </Button>
            <Button
              onClick={handleCancelEdit}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              إلغاء
            </Button>
          </div>
        </div>
      <ThemeToggle />
    </Card>
  );
}
