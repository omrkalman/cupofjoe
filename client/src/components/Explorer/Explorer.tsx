import { useEffect, useState, useRef, useCallback, Fragment, useMemo } from "react";
import { useDispatch } from "react-redux";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import Loading from "../../partials/Loading";
import ProductCard from "../ProductCard/ProductCard";
import { Product, Category } from '../../types/types';
import useProducts from "../../hooks/useProducts";
import { visualActions } from "../../store/visual";
import styles from './Explorer.module.css';

const Explorer = ({ id, category, favs, slogan }: 
    { 
        id: string,
        category: Category, 
        favs: number[],
        slogan?: string
    }
) => {

    const [products, setProducts] = useState([]);
    const [isMore, setIsMore] = useState(false);
    const [page, setPage] = useState(1);

    const gridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    
    const onScreen = useElementOnScreen(containerRef);
    const loadMore = useElementOnScreen(loadMoreRef);
    
    const populate = useProducts();
    
    const dispatch = useDispatch();
    
    useEffect(()=> {
        populate(setProducts, setIsMore, { category });
    }, []);    

    useEffect(() => {
        if (onScreen && products.length) {
            dispatch(visualActions.setGlowingCategory(category));    
        }
    }, [onScreen]);

    useEffect(() => {
        if (loadMore && products.length && isMore) {
            populate(setProducts, setIsMore, { category, page: page+1 });
            setPage(page + 1);
        }
    }, [loadMore]);

    const leftHandler = useCallback(()=> { 
        if (!!gridRef.current) {
            const child = gridRef.current.firstElementChild as HTMLElement | null;
            const size = child?.offsetWidth || 100;
            gridRef.current.scrollBy(-size, 0);
        }
    }, []);    

    const rightHandler = useCallback(()=> {  
        if (!!gridRef.current) {
            const child = gridRef.current.firstElementChild as HTMLElement | null;
            const size = child?.offsetWidth || 100;
            gridRef.current.scrollBy(size, 0);
        }
    }, []);    

    return ( <Fragment>
        <section id={id} ref={containerRef} className={styles.container + (onScreen ? ' onScreen' : '')}>
            <div className={styles.intro}>
                <h2>{category.substring(0, 1).toLocaleUpperCase() + category.substring(1)}</h2>
                {!!slogan && <h4 className={styles.slogan}>{`"${slogan}"`}</h4>}
            </div>
            <div className={styles.containerGrid}>
                <button onClick={leftHandler} className={styles.scrollBtn +' '+ styles.left + (products.length ? ` ${styles.show}`: '')}>➜</button>
                <button onClick={rightHandler} className={styles.scrollBtn +' '+ styles.right + (products.length ? ` ${styles.show}`: '')}>➜</button>
                <div ref={gridRef} className={styles.grid}>
                    {(!!products[0]) &&
                        products.map((p: Product) => <ProductCard key={p.idproduct} product={p} isFav={favs.includes(p.idproduct)} />)
                    }
                    {(!products[0]) && <Loading />}
                    <div className={styles.loaderContainer + (isMore ? ` ${styles.show}` : '')}>
                        <div ref={loadMoreRef} className={styles.loader}>
                            <Loading />
                        </div>
                    </div>  
                </div>
            </div>
        </section>
        
    </Fragment>);
}

export default Explorer;