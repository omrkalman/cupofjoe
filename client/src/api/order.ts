import API from "./API";

const baseRoute = '/order';

const api = new API(baseRoute);

const getOrders = () => api.get('');

const placeOrder = (order: Array<{ idproduct: number, qty: number }>) => api.post('', order);

const getLines = (idorder: number) => api.get(`/${idorder}`);

export {
    placeOrder,
    getOrders,
    getLines
}