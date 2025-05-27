import { useEffect, useState } from "react";
import Button from "./UI/Button";
import Input from "./UI/Input";
import { addCustomer } from "../api/customer";
import Table from "./UI/Table"; 

export default function SelectBuyer({setCustomer, setisOpen, customerArr}: any) {


    const columns = [
        { header: "الاسم", accessor: "الاسم" },
        { header: "الرقم", accessor: "الرقم" },
    ];
    

    const [newCustomer, setNewCustomer] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [customerNumber, setCustomerNumber] = useState('')
    const [customersData, setCustomersData] = useState([])

    const sumbit = async () => {
        try{

            const newCustomer = {
                name: customerName,
                ...(customerNumber && { customerNumber: customerNumber }),
            }
            const res = await addCustomer(newCustomer)
            console.log(res)
            
            setCustomer(customerName)
            setisOpen(false)
        }catch (error){
            console.error(error)
            alert('حدث خطأ الرجاء اعادة المحاولة')
        }
    }

    const getCus = async () => {
        try{

            setCustomersData(customerArr as any)

        }catch (error){
            console.error(error)
        }
    }

    useEffect(()=>{
        getCus()
    },[customerArr])

    return (
        <div className="dark:text-dark-text text-text">
            <div className="flex gap-3">
                <h2 className="text-xl font-bold mb-4">اختيار المشتري</h2>
                <Button 
                    className="h-8 bg-green-400 dark:bg-green-400 hover:bg-green-500 hover:dark:bg-green-500"
                    onClick={()=>{
                        setNewCustomer(true)
                    }}
                >مشتري جديد</Button>
            </div>


            {newCustomer ?
            
                <div className="">
                    <div className="">
                        الاسم :
                    <Input 
                        value={customerName}
                        onChange={(e) => {setCustomerName(e.target.value)}}
                    />
                    </div>
                    <div className="">
                        الرقم  : (اختياري)
                    <Input 
                        value={customerNumber}
                        onChange={(e) => {setCustomerNumber(e.target.value)}}
                    />
                    </div>
                </div>
            
            : 
            
            <Table
                columns={columns}
                data={customersData.map((prod: any) => ({
                    "الاسم": prod["name"],
                    "الرقم": prod["customerNumber"],
                    "المعرف": prod["id"],
                }))}
                onRowClick={(row)=>{
                    console.log(row["المعرف"])
                    setCustomer(row["المعرف"])
                    setisOpen(false)
                }}
            />
            }



            <Button
                onClick={()=>{
                    sumbit()
                }}
            >
                اختيار
            </Button>
            <Button
                onClick={()=>{
                    setisOpen(false)
                }}
                className="mt-4 mr-3 bg-red-500 dark:bg-red-500 text-white px-4 py-2 rounded"
            >
                إغلاق
            </Button>
        </div>
    );
}
