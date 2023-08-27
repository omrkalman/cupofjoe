import { useEffect, useMemo, useState } from 'react';
import { getOrders } from '../../api/order';
import Order from '../Order/Order';
import styles from './OrderHistory.module.css';

const OrderHistory = () => {

    const [orders, setOrders] = useState<Array<{ datetime: Date, idorder: number }>>([]);
    
    useEffect(() => {
        getOrders().then(({ data }) => {
            setOrders(
                data.body.orders.map((o: Object & { datetime: "yyyy-mm-ddThh:mm:ss.xxxZ" }) => (
                    { ...o, datetime: new Date(o.datetime) }
                )).reverse()
            );
        });
    }, []);

    const renderedOrders = useMemo(() => (
        orders.map((o) => (<Order key={Math.ceil(Math.random()*10E6)} order={o} />))
    ), [orders])

    return (
        <div className={styles.main}>
            {renderedOrders}
            {!orders[0] && <p>You haven't made any orders yet.</p>}
        </div>
    )
}

export default OrderHistory;