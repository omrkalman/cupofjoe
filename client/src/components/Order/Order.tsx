import { Fragment, useCallback, useEffect, useState, useMemo } from 'react';
import { getLines } from '../../api/order';
import Loading from '../../partials/Loading';
import styles from './Order.module.css';
import OrderLine from '../OrderLine/OrderLine';

const Order = ({ order }: {
    order: { 
        datetime: Date, 
        idorder: number 
    }
}) => {

    const [lines, setLines] = useState<Array<{ idproduct: number, qty: number, productName: string }>>([]);

    const [isOpen, setIsOpen] = useState(false);

    const detailsHandler = useCallback(() => { 
        if (isOpen) {
            setIsOpen(false);
            return;
        } //else
        setIsOpen(true);
        getLines(order.idorder).then(({ data }) => {
            setLines(data.body.lines);
        });
    }, [isOpen]);

    const renderedLines = useMemo(() => (
        isOpen && lines.map((l) => <OrderLine key={Math.ceil(Math.random()*10E6)} line={l} />)
    ), [isOpen, lines]);

    return <Fragment>
        <div className={styles.summary}>
            <span>📆 {order.datetime.toLocaleDateString('he')} 🕒 {order.datetime.toLocaleTimeString('he')}</span>
            <button onClick={detailsHandler} className={styles.detailsBtn}>Details <span className={isOpen ? styles.open : ''}>➤</span></button>
        </div>
        <div className={styles.linesContainer + (isOpen ? ` ${styles.open}` : '')}>
            {renderedLines}
            {isOpen && !lines[0] && <Loading />}
        </div>
    </Fragment>;
}

export default Order;