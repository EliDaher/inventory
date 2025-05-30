import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../component/ThemeToggle";
import Card from "../component/UI/Card";
import Table from "../component/UI/Table";
import { useEffect, useState } from "react";
import Button from "../component/UI/Button";
import Input from "../component/UI/Input";
import { addPayment } from "../api/customer";
import { deletePayment } from "../api/payments";
import { deleteInoive } from "../api/invoices";

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
        { header: "", accessor: "حزف", 
            render: (row: any) => (
              <Button
                className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600"
                onClick={async () => {
                    if(window.confirm('هل انت متأكد من عملية الحزف')){
                        try{

                            if(row['القيمة'].props.children > 0) {
                                    const res = await deletePayment({
                                    paymentDate: row['التاريخ'],
                                    paymentId: row['id'],
                                    paymentValue: row['القيمة'].props.children,
                                    customerId: customerData['المعرف'],
                                })
                                if(res.success){
                                    alert('تم الحزف بنجاح')
                                    navigate('/customers')
                                }

                            }else{

                                const res = await deleteInoive({
                                    invoiceDate: row['التاريخ'],
                                    invoiceId: row['id'],
                                    invoiceValue: -row['القيمة'].props.children,
                                    customerId: customerData['المعرف'],
                                })
                                if(res.success){
                                    alert('تم الحزف بنجاح')
                                    navigate('/customers')
                                }

                            }
                        
                        }catch (err) {
                            console.error(err)
                        }
                    }
                }}
              >حزف</Button>

            ),
         },
    ];  

    useEffect(()=>{
        setData(customerData['الفواتير'] && Object.values(customerData['الفواتير']))
    }, [customerData])


    const formatDate = (isoDate: any) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const submit = async () => {
        try{

            const res = await addPayment({
                paymentValue: payValue,
                customerName: customerData['الاسم'],
                customerId: customerData['المعرف'],
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
                        "القيمة": (
                          <span style={{ fontWeight: "bold" ,color: prod.finalAmount > 0 ? "green" : "red"}}>
                            {prod.finalAmount.toFixed(2)}
                          </span>
                        ),
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
