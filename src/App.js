import {Route, BrowserRouter, Routes, Navigate} from "react-router-dom";
import Order from "./pages/Order";
import OrderConfirm from "./pages/OrderConfirm";
import OrderBillingKey from "./pages/Order_billingKey";
import Result from "./pages/Result";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/order" replace/>}/>
                <Route path="/order" element={<Order/>}/>
                <Route path="/order_confirm" element={<OrderConfirm/>}/>
                <Route path="/order_billingKey" element={<OrderBillingKey/>}/>
                <Route path="/result" element={<Result/>}/>
                <Route path="*" element={<Navigate to="/order" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
