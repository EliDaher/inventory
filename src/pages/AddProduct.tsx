import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { addProduct } from "../api/products";
import { addCategory, getCategory } from "../api/category";

type ProductForm = {
  name: string;
  buyPrice: number;
  sellPrice: number;
  unit: string;
  quantity: number;
  discount?: number;
  category: string;
  description?: string;
};

const AddProduct: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    defaultValues: {
      quantity: 1,
      discount: 0,
    },
  });

  const [categories, setCategories] = useState<string[]>(["غير ذلك"]);
  const [newCategory, setNewCategory] = useState("");
  const selectedCategory = watch("category");

  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(false);

  const quantity = watch("quantity") || 0;
  const buyPrice = watch("buyPrice") || 0;
  const discount = watch("discount") || 0;

  useEffect(() => {
    const totalValue = buyPrice * quantity - discount;
    setTotal(totalValue);
  }, [buyPrice, quantity, discount]);

  const onSubmit = async (data: ProductForm) => {

    if(data.category === "غير ذلك"){
      addCategory({name: newCategory})
    }

    const finalData = {
      ...data,
      category: data.category === "غير ذلك" ? newCategory : data.category,
    };
  
    try {
      const result = await addProduct(finalData);
      console.log("✅ تمت الإضافة:", result);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      reset();
      setNewCategory("");
    } catch (error: any) {
      console.error("❌ خطأ في الإضافة:", error.response?.data || error.message);
    }
  };


  const getCategories = async () => {
    try {
      const res = await getCategory();
    
      // تحويل كائن التصنيفات إلى مصفوفة من الكائنات
      const categoryArray = Object.entries(res.categoryData).map(([id, data]: [string, any]) => ({
        id,
        ...data,
      }));
    
      // استخراج الأسماء فقط
      const categoryNames = categoryArray.map(cat => cat.name);
    
      // دمج التصنيفات القديمة مع الجديدة + "غير ذلك"
      const baseCategories = ["غير ذلك"];
      const allCategories = Array.from(new Set([...baseCategories, ...categoryNames]));
    
      // حفظ التصنيفات بدون تكرار
      setCategories(allCategories);
    } catch (error) {
      console.error("فشل جلب التصنيفات:", error);
    }
  };



  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div dir="rtl" className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-all">
      <h1 className="text-3xl font-bold text-center text-primary dark:text-primary mb-8">إضافة منتج جديد</h1>

      {success && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/30 p-3 mb-6 rounded-lg border border-green-300 dark:border-green-600 transition-all">
          <CheckCircle2 className="w-5 h-5" />
          <span>تمت إضافة المنتج بنجاح</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* اسم المنتج */}
        <div className="col-span-full">
          <label className="label"> اسم المنتج</label>
          <input
            {...register("name", { required: "الاسم مطلوب" })}
            placeholder="مثال: شاحن سامسونج"
            className="input"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* التصنيف */}
        <div>
          <label className="label"> التصنيف</label>
          <Controller
            control={control}
            name="category"
            rules={{ required: "اختر تصنيفًا" }}
            render={({ field }) => (
              <select {...field} className="input">
                <option value="">-- اختر التصنيف --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          />
          {errors.category && <p className="error">{errors.category.message}</p>}
        </div>
          
        {/* التصنيف الجديد عند اختيار "غير ذلك" */}
        {selectedCategory === "غير ذلك" && (
          <div>
            <label className="label">أدخل اسم التصنيف الجديد</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="مثال: بلور"
              className="input"
              required
            />
          </div>
        )}


        {/* سعر الشراء */}
        <div>
          <label className="label"> سعر الشراء</label>
          <input
            type="number"
            step="0.01"
            {...register("buyPrice", { required: "مطلوب" })}
            placeholder="مثال: 12000"
            className="input"
          />
        </div>

        {/* سعر المبيع */}
        <div>
          <label className="label"> سعر المبيع</label>
          <input
            type="number"
            step="0.01"
            {...register("sellPrice", { required: "مطلوب" })}
            placeholder="مثال: 15000"
            className="input"
          />
        </div>

        {/* الواحدة */}
        <div>
          <label className="label"> الواحدة</label>
          <input
            type="text"
            {...register("unit", { required: "مطلوب" })}
            placeholder="مثال: kg"
            className="input"
          />
        </div>

        {/* الكمية */}
        <div>
          <label className="label"> الكمية</label>
          <input
            type="number"
            {...register("quantity", { required: "مطلوب", min: 1 })}
            placeholder="مثال: 5"
            className="input"
          />
        </div>

        {/* الحسم */}
        <div>
          <label className="label"> الحسم (اختياري)</label>
          <input
            type="number"
            {...register("discount")}
            placeholder="مثال: 500"
            className="input"
          />
        </div>

        {/* المجموع النهائي */}
        <div className="col-span-full text-center text-xl font-bold bg-gray-50 dark:bg-gray-800 py-4 rounded-lg text-primary dark:text-primary border border-gray-200 dark:border-gray-700">
          المجموع: {total.toLocaleString()} ل.س
        </div>

        <button
          type="submit"
          className="col-span-full w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition-all font-bold"
        >
          حفظ المنتج
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
