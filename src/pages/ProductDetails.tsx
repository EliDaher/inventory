import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "../component/UI/Input";

interface Product {
  id: string;
  الاسم: string;
  الكمية: number;
  التصنيف: string;
  "السعر شراء": number;
  "السعر بيع": number;
  الوحدة: string;
}

export default function ProductDetails() {
  const location = useLocation();
  const [productData, setProductData] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState<number>(0);

  useEffect(() => {
    if (location.state) {
      setProductData(location.state as Product);
    }
  }, [location.state]);

  const handleSell = () => {
    if (!productData) return;

    if (sellQuantity <= 0 || sellQuantity > productData.الكمية) {
      alert("الكمية غير صحيحة");
      return;
    }

    const remaining = productData.الكمية - sellQuantity;

    alert(`تم بيع ${sellQuantity} ${productData.الوحدة}. الكمية المتبقية: ${remaining}`);

    // تحديث الكمية بعد البيع محليًا
    setProductData({ ...productData, الكمية: remaining });
    setSellQuantity(0);
    setIsSellModalOpen(false);
  };

  if (!productData)
    return <div className="p-4 text-gray-500">لا يوجد بيانات لعرضها.</div>;

  return (
    <div dir="rtl" className="p-6 max-w-2xl mx-auto mt-10 mx-5 bg-dark-background/5 dark:bg-background/5 shadow-xl rounded-2xl font-sans">
      <h2 className="text-3xl font-bold text-center mb-6">{productData.الاسم}</h2>


        <div>

            <Input placeholder="الكمية"></Input>

        </div>


      <div className="flex justify-center gap-6">
        <button
          onClick={() => alert("ميزة التعديل غير مفعلة بعد")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          ✏️ تعديل
        </button>

        <button
          onClick={() => setIsSellModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
        >
          🛒 بيع
        </button>
      </div>

      {/* Modal للبيع */}
      {isSellModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-bold mb-4">
              كمية البيع ({productData.الوحدة})
            </h3>
            <input
              type="number"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded mb-4 text-center"
              placeholder={`أدخل الكمية (المتاح: ${productData.الكمية})`}
              min={1}
              max={productData.الكمية}
            />

            {/* حسم على البيع */}
            <h3 className="text-xl font-bold mb-4">
              كمية البيع ({productData.الوحدة})
            </h3>
            <input
              type="number"
              value={sellQuantity}
              onChange={(e) => setSellQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded mb-4 text-center"
              placeholder={`أدخل الكمية (المتاح: ${productData.الكمية})`}
              min={1}
              max={productData.الكمية}
            />
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSell}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                تأكيد البيع
              </button>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
