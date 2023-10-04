import {BrowserRouter,Routes,Route} from "react-router-dom"
import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./page/home/HomePage";
import AboutPage from "./page/about/AboutPage";
import CustomerPage from "./page/customer/CustomerPage"
import UserPage from "./page/user/UserPage"
import CategoryPage from "./page/category/CategoryPage"
import RouteNotFoundPage from "./page/route-not-found/RouteNotFoundPage"
import ProductPage from "./page/product/PorductPage";
import Layout from "./component/layout/Layout";

import LayoutDashboard from "./component/layout/LayoutDashboard";
import CustomerPageDash from "./page-dashboard/customer/CustomerPageDash";
import EmployeeDash from "./page-dashboard/employee/EmployeeDash";
import OrderPageDash from "./page-dashboard/order/OrderPageDash";

// product dashboard
import CategoryPageDash from "./page-dashboard/product/CategoryPageDash";
import ProductPageDash from "./page-dashboard/product/ProductPageDash";

// user 
import RolePageDash from "./page-dashboard/user/RolePageDash";
import UserRoleDash from "./page-dashboard/user/UserRoleDash";

// system
import OrderStatusPageDash from "./page-dashboard/system/OrderStatusPageDash";
import OrderPaymentPageDash from "./page-dashboard/system/OrderPaymentPageDash";
import ProvincePageDash from "./page-dashboard/system/ProvincePageDash";

// report
import TopSalePageDash from "./page-dashboard/report/TopSalePageDash";
import SaleSummaryPageDash from "./page-dashboard/report/SaleSummaryPageDash";
import SoldByCategoryPage from "./page-dashboard/report/SoldByCategoryPage";
import SoldByProductPageDash from "./page-dashboard/report/SoldByProductPageDash";

import HomePageDash from "./page-dashboard/home/HomePage";
import LayoutDashboardLogin from "./component/layout/LayoutDashboardLogin";
import LoginDashBoard from "./page-dashboard/login/LoginDashBoard";
import RegisterDashBoard from "./page-dashboard/register/RegisterDashBoard";



function App() {
  // check is has path "dashboard"
  const is_dashbord = window.location.pathname.includes("dashboard") // true/false
  return (
    <BrowserRouter>
      {/* Route website  & backend*/}
      <Routes>
        {/* website */}
        <Route path="/" element={<Layout />}>
          <Route path="" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="product" element={<ProductPage />} />
          <Route path="cateory" element={<CategoryPage />} />
        </Route>

        {/* backend */}
        <Route path="/dashboard" element={<LayoutDashboard />}>
            <Route path="" element={<HomePageDash/> } />
            <Route path="customer" element={<CustomerPageDash/>} />
            <Route path="employee" element={<EmployeeDash/>} />
            <Route path="order" element={<OrderPageDash/>} />

            <Route path="product/category" element={<CategoryPageDash/>} />
            <Route path="product/productlist" element={<ProductPageDash/>} />

            <Route path="user/role" element={<RolePageDash/>} />
            <Route path="user/userrole" element={<UserRoleDash/>} />

            <Route path="system/orderstatus" element={<OrderStatusPageDash/>} />
            <Route path="system/orderpayment" element={<OrderPaymentPageDash/>} />
            <Route path="system/province" element={<ProvincePageDash/>} />

            <Route path="report/topsale" element={<TopSalePageDash/>} />
            <Route path="report/salesummary" element={<SaleSummaryPageDash/>} />
            <Route path="report/soldbycategory" element={<SoldByCategoryPage/>} />
            <Route path="report/soldbyproduct" element={<SoldByProductPageDash/>} />

        </Route>

        {/* backend login register*/}
        <Route path="/dashboard" element={<LayoutDashboardLogin />}>
            <Route path="login" element={<LoginDashBoard/> } />
            <Route path="register" element={<RegisterDashBoard/>} />
        </Route>

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;


/* { !is_dashbord && // config route for website public 
        <div>
          <Layout />
          <Routes>
              <Route path="" element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="customer" element={<CustomerPage />} />
              <Route path="user" element={<UserPage />} />
              <Route path="product" element={<ProductPage />} />
              <Route path="cateory" element={<CategoryPage />} />
              <Route path="*" element={<RouteNotFoundPage />} />
          </Routes>
        </div> 
      }

      {is_dashbord && // config route for backend (require login)
        <div>
          <LayoutDashboard />
          <Routes>
            <Route path="dashboard">
              <Route path="" element={<HomePageDash/>} />
              <Route path="customer" element={<CustomerPageDash/> } />
              <Route path="cart" element={<CartPageDash/>} />
              <Route path="category" element={<OrderPageDash/>} />
              <Route path="product" element={<ProductPageDash/>} />
            </Route>
          </Routes> 
        </div>
      } */
