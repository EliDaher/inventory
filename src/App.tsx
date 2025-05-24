import { HashRouter, Routes, Route } from "react-router-dom"
import ProductsPage from "./pages/ProductsPage"
import Navbar from "./component/Navbar"
import AddProduct from "./pages/AddProduct"
import ProductDetails from "./pages/ProductDetails"


function App() {

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">

        <div className="pb-8">
          <Navbar/>
        </div>

        <div className="bg-background dark:bg-dark-background flex-1">
          <Routes>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/ProductDetails" element={<ProductDetails />} />
          </Routes>
        </div>

      </div>
    </HashRouter>
  )
}

export default App
