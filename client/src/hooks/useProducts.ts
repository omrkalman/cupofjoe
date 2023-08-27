import { getProductsBy } from "../api/product";
import { ProductFilters, Product } from "../types/types";

const useProducts = () => {
    return async(setProducts: Function, setIsMore?: Function, options?: ProductFilters) => {
        try {
            const { data } = await getProductsBy(options);
            if (options?.page && options?.page > 1) {
                setProducts((prev: Product[]) => [...prev, ...data.body.products]);
            } else {
                setProducts(data.body.products);
            }
            if(setIsMore) setIsMore(data.body.discrepancy === 0);
        } catch(error) {
            console.error(error);
            if(setIsMore) setIsMore(false);
        }
    }
}

export default useProducts;