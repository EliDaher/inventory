import Table from "../component/UI/Table";
import ThemeToggle from "../component/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCustomers } from "../api/customer";


export default function Customers() {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  

    const columns = [
        { header: "الاسم", accessor: "الاسم" },
        { header: "الرقم", accessor: "الرقم" },
        { header: "الرصيد", accessor: "الرصيد" },
    ];  
    
    const getCust = async () => {
      const res = await getCustomers();
      const tempCustomerArr = Object.values(res.customerData);
      setData(tempCustomerArr as any);
    };

    useEffect(() => {
      getCust();
    }, []);
    
  return (
    <div className="p-6 bg-background dark:bg-dark-background">

      {/*<div className="flex flex-row-reverse items-center justify-between mb-2">
        <h1 className="text-text dark:text-dark-text text-2xl text-right font-cairo">المنتجات</h1>
        <Button
          onClick={() => {
            navigate("/addProduct");
          }}
          className="bg-accent/90 dark:bg-dark-accent hover:bg-accent-hover dark:hover:bg-dark-accent-hover"
        >
          اضافة زبون
        </Button>
      </div>*/}

      <Table
        columns={columns}
        data={data.map((prod) => ({
            "الاسم": prod["name"],
            "الرقم": prod["customerNumber"],
            "الرصيد": !prod["balance"] ? 'لا يوجد فواتير' : prod["balance"] < 0 ? `عليه ${-Number(prod['balance'])}` : `له ${Number(prod['balance'])}`,
            "الفواتير": prod["invoices"],
            "المعرف": prod["id"],
        }))}
        onRowClick={(row) => {
            console.log(row)
            navigate('/customerDetails', {state: row})
        }}
      />

      <ThemeToggle />
    </div>
  );
}
