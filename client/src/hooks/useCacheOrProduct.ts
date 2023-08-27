import { getProduct } from "../api/product";

export default function() {
    return async(idproduct: number) => {
        let cache = sessionStorage.getItem(''+idproduct);
        if (cache) return JSON.parse(cache);
        //else
        return getProduct(idproduct).then(({ data }) => {
            sessionStorage.setItem(''+idproduct, JSON.stringify(data.body.product));
            return data.body.product;
        });
    }
}