import { Fragment, useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ProductFilters, Product } from '../../types/types';
import { getImageUrl } from '../../api/images';
import ListProduct from '../ListProduct/ListProduct';
import { filtersActions } from '../../store/filters';
import useElementOnScreen from '../../hooks/useElementOnScreen';
import useProducts from '../../hooks/useProducts';
import Loading from '../../partials/Loading';
import styles from './ProductList.module.css';

const ProductList = () => {

    const filters = useSelector((state: {filters: ProductFilters}) => state.filters);

    const [products, setProducts] = useState([]);

    const [isMore, setIsMore] = useState(true);

    const loadMoreRef = useRef<HTMLDivElement>(null)

    const loadMore = useElementOnScreen(loadMoreRef);

    const populateProducts = useProducts();

    const dispatch = useDispatch();

    useEffect(()=> {
        if (loadMore && products.length && isMore) {
            dispatch(filtersActions.nextPage());
        }
    }, [loadMore, isMore]);

    useEffect(()=> {
        populateProducts(setProducts, setIsMore, filters);
    }, [filters]);

    

    return (
        <Fragment>    
            <div className={styles.main}>
                {products.map((p: Product) => (
                    <ListProduct key={Math.ceil(Math.random()*10E6)} product={p} />
                ))}
            </div>
            <div className={styles.loader} ref={loadMoreRef}>
                {isMore && <Loading />}
            </div>
        </Fragment>
    );
}

export default ProductList;