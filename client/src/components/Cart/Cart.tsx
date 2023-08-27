import { useCallback, useEffect, useState, useMemo, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Product } from '../../types/types';
import { placeOrder } from '../../api/order';
import useCacheOrProduct from '../../hooks/useCacheOrProduct';
import Loading from '../../partials/Loading';
import CartItem from '../CartItem/CartItem';
import Price from '../../partials/Price';
import ROUTES from '../../routes/routes';
import styles from './Cart.module.css';

const Cart = () => {

    const iduser = useSelector((state: any) => state.user.iduser);

    const [cart, setCart] = useState<Array<{ idproduct: number, qty: number }>>([]);

    const [products, setProducts] = useState<Product[]>([]);

    const [orderStatus, setOrderStatus] = useState<{ isPlaced: boolean, isSuccess: boolean, msg: string }>(
        { isPlaced: false, isSuccess: false, msg: '' }
    );
    
    const loadCart = useCallback(() => {
        let temp:Array<{ idproduct: number, qty: number }>  = JSON.parse(localStorage.getItem(`cart-${iduser}`) || '[]');
        setCart(temp);
        return temp;
    }, []);

    const productify = useCacheOrProduct();

    useEffect(() => {
        loadCart().forEach((l) => {
            productify(l.idproduct).then((product) => {
                setProducts(prev => [ ...prev, product ]);
            });
        });
    }, []);

    const total = useMemo(() => {
        let temp = cart.map((l) => {
            let found = products.find((p) => (p.idproduct === l.idproduct));
            if (found) {
                return l.qty * Math.round(100 * parseFloat(found.price)); 
            } //else
            return 0;
        }).reduce((x, y) => (x + y), 0);

        let dollars = Math.floor(temp / 100);
        let cents: any = temp % 100;

        if (cents < 10) cents = '0'+cents;

        return '' + dollars + '.' + cents;

    }, [cart, products]);

    const removeFromCart = useCallback((idproduct: number) => {
        let temp = cart.filter((item) => item.idproduct !== idproduct);
        setCart(temp);
        localStorage.setItem(`cart-${iduser}`, JSON.stringify(temp));
    }, [cart]);

    const addQty = useCallback((idproduct: number) => {
        let temp = cart.map((item) => {
            if (item.idproduct === idproduct) return { ...item, qty: (item.qty+1) }
            //else
            return item;
        })
        setCart(temp);
        localStorage.setItem(`cart-${iduser}`, JSON.stringify(temp));
    }, [cart]);

    const subQty = useCallback((idproduct: number) => {
        let temp = cart.map((item) => {
            if (item.idproduct === idproduct) return { ...item, qty: (item.qty-1) }
            //else
            return item;
        })
        setCart(temp);
        localStorage.setItem(`cart-${iduser}`, JSON.stringify(temp));
    }, [cart]);

    const renderedCart = useMemo(() => (
        cart.map((l) => (
            <CartItem
                key={Math.ceil(Math.random() * 10E6)}
                line={l}
                product={products.find((p) => (p.idproduct === l.idproduct))}
                removeFromCart={removeFromCart}
                addQty={addQty}
                subQty={subQty}
            />
        ))
    ), [cart, products]);

    const orderHandler = useCallback(() => {
        setOrderStatus({ isPlaced: true, isSuccess: false, msg: '' });
        placeOrder(cart).then(({ data }) => {
            setOrderStatus({ isPlaced: true, isSuccess: true, msg: data.body.msg[0] });
        }).catch((error) => {
            setOrderStatus({ isPlaced: true, isSuccess: false, msg: error?.response?.data?.body?.msg.join() || 'Error occured' })
        })
    }, [cart]);

    return (
        <div className={styles.main}>
            {(!!cart[0]) && <Fragment>
                {renderedCart}
                {!!parseInt(total) && <Fragment>
                    <h2 className={styles.total}>Total: {<Price amount={total} currency='nis' />}</h2>
                    {orderStatus.isPlaced ? (
                        orderStatus.msg ? (
                            <p className={styles.statusMsg + (orderStatus.isSuccess ? ` ${styles.success}` : '')}>{orderStatus.msg}</p>
                        ) : <div style={{textAlign: 'center'}}><Loading /></div>
                    ) : <button onClick={orderHandler} className={styles.checkout}>Check out</button>}
                </Fragment>}
            </Fragment>}
            {(!cart[0]) && 
                <p className={styles.emptyMsg}>Your cart is still empty. <NavLink to={ROUTES.ShopPage}>Browse products</NavLink></p>
            }
        </div>
    );  
}

export default Cart;