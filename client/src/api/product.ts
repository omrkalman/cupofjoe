import API from './API';
import { ProductFilters, EditableProductField, Product, Category } from '../types/types';
import { AxiosRequestConfig } from 'axios';

const baseRoute = '/product';

const api = new API(baseRoute);

const getProductsBy = (options?: ProductFilters) => {
    if (!options) return api.get('/');
    // else
    const optionsArr = Object.entries(options);
    if (!optionsArr[0]) return api.get('/');
    // else
    let url = '/?';
    optionsArr.forEach(([key, value], index) => {
        if (value) {
            const ampersand = (index === 0 ? '' : '&');
            url += (`${ampersand}${key}=${value}`);
        }
    })
    return api.get(url);
}

const getProduct = (id: number) => api.get(`/${id}`);

const edit = (obj: {
    idproduct: number,
    values: {
        [K in EditableProductField]?: EditableProductField[keyof EditableProductField]
    }
}) => api.patch('/', obj);

const restock = (lines: Array<{ idproduct: number, qty: number }> ) => api.patch('/restock', lines);

const getHiddens = () => api.get('/hidden');

const unhide = (idproduct: number) => edit({ idproduct, values: { hide: 0 } })

const deleteProduct = (idproduct: number) => api.delete(`/${idproduct}`);

const add = (product: {
    name: string,
    price: number,
    category: Category,
    stock: number,
    desc?: string,
    hide?: 0 | 1
}) => api.post('/', product);

const uploadImage = (data: any, config: AxiosRequestConfig) => api.post('/image', data, config)

export {
    getProductsBy,
    getProduct,
    edit,
    restock,
    unhide,
    getHiddens,
    deleteProduct,
    add,
    uploadImage
}