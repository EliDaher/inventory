import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../component/ThemeToggle";
import Card from "../component/UI/Card";
import Table from "../component/UI/Table";
import { useEffect, useState } from "react";
import Button from "../component/UI/Button";
import Input from "../component/UI/Input";
import { addPayment } from "../api/customer";

export default function CustomerDetails() {

    const navigate = useNavigate()
    const location = useLocation()
    const customerData = location.state

    const [data, setData] = useState<any[]>([]);

    const [isOpen, setIsOpen] = useState(false)
    const [payValue, setPayValue] = useState(0)
    const [details, setDetails] = useState('')
    
    const columns = [
        { header: "القيمة", accessor: "القيمة" },
        { header: "التاريخ", accessor: "التاريخ" },
        { header: "عدد الفطع", accessor: "عدد الفطع" },
    ];  

    useEffect(()=>{
        setData(customerData['الفواتير'] && Object.values(customerData['الفواتير']))
    }, [customerData])


    const formatDate = (isoDate: any) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const submit = async () => {
        try{

            const res = await addPayment({
                paymentValue: payValue,
                customerName: customerData['الاسم'],
                customerId: customerData['المعرف'],
                details: details
            })

            console.log(res)
            if(res.success){
                setPayValue(0)
                setIsOpen(false)
                navigate('/customers')
            }

        }catch (error){
            console.error(error)
        }
    }

    return (
        <div className="p-6 bg-background dark:bg-dark-background text-text dark:text-dark-text">
            <Card
                className="flex flex-row justify-between"
            >
                <div>
                    {/*customerData['المعرف']*/}
                    <h1>{customerData['الاسم']}</h1>
                    <h3>{customerData['الرقم']}</h3>
                    <h3>{customerData['الرصيد']} $</h3>
                </div>

                <Button
                    onClick={(()=>{
                        setIsOpen(true)
                    })}
                >
                    اضافة دفعة
                </Button>
            </Card>

            <Card className="mt-5">
                
                { data && <Table
                    columns={columns}
                    data={data.map((prod) => ({
                        "القيمة": prod.finalAmount,
                        "التاريخ": formatDate(prod.createdAt),
                        "عدد الفطع": prod.items ? prod.items.length : 0,
                        "id": prod.id,
                    }))}
                />}
            </Card>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div
                      className="bg-white dark:bg-dark-background p-6 rounded-xl shadow-xl relative w-full max-w-2xl"
                      onClick={(e) => e.stopPropagation()} // منع إغلاق المودال عند الضغط داخل المحتوى
                    >
                      {/* زر الإغلاق */}
                      <button
                        className="absolute top-2 left-2 text-xl text-gray-500 hover:text-red-500"
                        onClick={() => setIsOpen(false)}
                      >
                        ✕
                      </button>
                
                      {/* محتوى */}
                        <div className="">
                            <div className="">
                                <Input 
                                    label="قيمة الدفعة"
                                    value={payValue}
                                    onChange={(e) => {setPayValue(Number(e.target.value))}}
                                />
                                <Input 
                                    label="ملاحظات"
                                    value={details}
                                    onChange={(e) => {setDetails(e.target.value)}}
                                />
                                <Button className="mr-auto"
                                    onClick={submit}
                                >
                                    حفظ
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <ThemeToggle />
        </div>
    )
}
