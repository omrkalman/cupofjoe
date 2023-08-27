import { useEffect, useState } from 'react';
import { Product } from '../../types/types';
import useCacheOrProduct from '../../hooks/useCacheOrProduct';
import styles from './OrderLine.module.css';

const OrderLine = ({ line }: {
    line: { idproduct: number, qty: number }
}) => {

    const [product, setProduct] = useState<Product>();

    const productify = useCacheOrProduct();

    useEffect(() => {
        productify(line.idproduct).then((p) => {
            setProduct(p);
        })
    }, []);

    return <p className={styles.line}>{product?.name || 'Loading...'}<span style={{float: 'right'}}> x{line.qty}</span></p>
}

export default OrderLine;