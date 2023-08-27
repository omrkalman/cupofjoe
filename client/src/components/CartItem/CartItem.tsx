import { Fragment, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/types';
import Loading from '../../partials/Loading';
import Price from '../../partials/Price';
import styles from './CartItem.module.css';

const CartItem = ({ line, product, removeFromCart, addQty, subQty }: {
    line: {
        idproduct: number,
        qty: number
    }, 
    product: Product | undefined,
    removeFromCart: Function,
    addQty: Function, 
    subQty: Function
}) => {

    const [isOutOfStock, setIsOutOfStock] = useState(false);

    const total = useMemo(() => {
        if (product?.price) {

            let multi100 = line.qty * Math.round(100 * parseFloat(product.price));
            
            let dollars = Math.floor(multi100 / 100);
            let cents: any = multi100 % 100;

            if (cents < 10) cents = '0'+cents;

            return '' + dollars + '.' + cents;
            
        } //else
        return '';
    }, [product?.price]);

    const addHandler = useCallback(() => {
        if (product?.stock) {
            if (line.qty < product.stock) addQty(line.idproduct);
            else setIsOutOfStock(true);
        }
    }, [product?.price]);

    const navigate = useNavigate();

    return (
        <div className={styles.item}>
            {!!product && <Fragment>
                <button className={styles.detail} onClick={() => {removeFromCart(line.idproduct)}}>✕</button>
                <span className={styles.detail +' '+ styles.name} onClick={() => {navigate(`/product/${product.idproduct}`)}}>{product.name}</span>
                <Price className={styles.detail} currency='nis' amount={product.price} category={product.category} />
                <span className={styles.detail + (isOutOfStock ? ` ${styles.outOfStock}` : '')}>
                    <button className={styles.qtyBtn +' '+ styles.minus} onClick={() => {if (line.qty > 1) subQty(line.idproduct)}}>-</button>
                    {line.qty}
                    <button className={styles.qtyBtn +' '+ styles.plus} onClick={addHandler} onMouseLeave={() => {setIsOutOfStock(false);}}>+</button>
                </span>
                <Price className={styles.detail} currency='nis' amount={total} />
            </Fragment>}
            
            {!product && <Loading />}
        </div>
    );
}

export default CartItem;