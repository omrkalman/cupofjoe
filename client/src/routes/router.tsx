import { Routes, Route, Navigate } from "react-router-dom";
import ROUTES from './routes';
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/NotFound/NotFound";
import HomePage from "../pages/HomePage/HomePage";
import ShopPage from "../pages/ShopPage/ShopPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import ProductPage from "../pages/ProductPage/ProductPage";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import AdminPage from "../pages/AdminPage/AdminPage";

const Router = () => {
    return (
        <Routes>
            <Route path={ROUTES.HomePage} element={<ProtectedRoute element={<DashboardPage />} alt={"shop"} />} />            
            <Route path={ROUTES.NotFound} element={<NotFound />} />
            <Route path={ROUTES.ShopPage} element={<ShopPage />} />
            <Route path={ROUTES.LoginPage} element={<LoginPage />} />
            <Route path={ROUTES.SignupPage} element={<SignupPage />} />
            <Route path={ROUTES.ProfilePage} element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path={ROUTES.ProductPage} element={<ProductPage />} />
            <Route path={ROUTES.AdminPage} element={<ProtectedRoute element={<AdminPage />} />} />
            <Route path='*' element={<Navigate to={ROUTES.NotFound} />} />
        </Routes>
    );
}
export default Router;