import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { getImageUrl } from "../../api/images";
import { Product } from "../../types/types";
import Price from "../../partials/Price";
import styles from './ListProduct.module.css';

const ListProduct = ({ product }: 
    { product: Product }
) => {

    const navigate = useNavigate();

    const clickHandler = useCallback(() => {
        navigate(`/product/${product.idproduct}`);
    }, []);


    return (
        <div className={styles.product} onClick={clickHandler} key={Math.floor(Math.random() * 10E6)}>
            <div className={styles.col}>
                <div className={styles.category}>
                    <div className={styles[product.category]}>{product.category.substring(0, 1).toLocaleUpperCase() + product.category.substring(1)}</div>
                    <img src={getImageUrl(product.category + '.png')} alt={product.category} />
                </div>
            </div>
            <div className={styles.col + ' ' + styles.colBig}>
                <div className={styles.enlarge + ' ' + styles.boldify} title={product.name}>{product.name}</div>
                <div title={product.desc}>{product.desc}</div>
            </div>
            <div className={styles.col + ' ' + styles.colEnd}>
                <div title={product.price}><Price amount={product.price} currency='nis' category={product.category}  /></div>
                <div className={styles.minimize} title={'stock'}>{product.stock + ' in stock'}</div>
            </div>
            <img className={styles.productImg} src={getImageUrl(product.img)} title={product.name} alt={product.name} />
        </div>
    );
}

export default ListProduct;