import { useEffect, useState } from "react";
import Button from "./UI/Button";
import Input from "./UI/Input";
import { addDealer } from "../api/dealer";
import Table from "./UI/Table"; 

export default function SelectDealer({setDealer, setisOpen, dealerArr}: any) {


    const columns = [
        { header: "الاسم", accessor: "الاسم" },
        { header: "الرقم", accessor: "الرقم" },
    ];
    

    const [newDealer, setNewDealer] = useState(false)
    const [dealerName, setDealerName] = useState('')
    const [dealerNumber, setDealerNumber] = useState('')
    const [dealersData, setDealersData] = useState([])

    const sumbit = async () => {
        try{

            const newDealer = {
                name: dealerName,
                ...(dealerNumber && { dealerNumber: dealerNumber }),
            }
            const res = await addDealer(newDealer)
            console.log(res)
            
            setDealer(dealerName)
            setisOpen(false)
        }catch (error){
            console.error(error)
            alert('حدث خطأ الرجاء اعادة المحاولة')
        }
    }

    const getCus = async () => {
        try{

            setDealersData(dealerArr as any)

        }catch (error){
            console.error(error)
        }
    }

    useEffect(()=>{
        getCus()
    },[dealerArr])

    return (
        <div className="dark:text-dark-text text-text">
            <div className="flex gap-3">
                <h2 className="text-xl font-bold mb-4">اختيار البائع</h2>
                <Button 
                    className="h-8 bg-green-400 dark:bg-green-400 hover:bg-green-500 hover:dark:bg-green-500"
                    onClick={()=>{
                        setNewDealer(true)
                    }}
                >بائغ جديد</Button>
            </div>


            {newDealer ?
            
                <div className="">
                    <div className="">
                        الاسم :
                    <Input 
                        value={dealerName}
                        onChange={(e) => {setDealerName(e.target.value)}}
                    />
                    </div>
                    <div className="">
                        الرقم  : (اختياري)
                    <Input 
                        value={dealerNumber}
                        onChange={(e) => {setDealerNumber(e.target.value)}}
                    />
                    </div>
                </div>
            
            : 
            
            <Table
                columns={columns}
                data={dealersData.map((prod: any) => ({
                    "الاسم": prod["name"],
                    "الرقم": prod["dealerNumber"],
                    "المعرف": prod["id"],
                }))}
                onRowClick={(row)=>{
                    console.log(row["المعرف"])
                    setDealer(row["المعرف"])
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
