import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ROUTES from './routes';

const ProtectedRoute = ({ element, alt }: { element: JSX.Element, alt?: JSX.Element | string }) => {
    const isAuth = useSelector((state: any) => state.user.isAuth);
    if (isAuth) return element;
    else if (typeof alt === 'object') return alt;
    else return <Navigate to={alt || ROUTES.NotFound} replace />
}

export default ProtectedRoute;