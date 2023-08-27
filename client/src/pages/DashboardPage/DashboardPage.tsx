import { useSelector } from 'react-redux';
import { useRef, useState } from 'react';
import FavDisplayer from '../../components/FavDisplayer/FavDisplayer';
import Cart from '../../components/Cart/Cart';
import useElementOnScreen from '../../hooks/useElementOnScreen';
import CartIcon from '../../partials/CartIcon';
import HeartIcon from '../../partials/HeartIcon';
import HistoryIcon from '../../partials/HistoryIcon';
import OrderHistory from '../../components/OrderHistory/OrderHistory';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {

    const fn = useSelector((state: any) => state.user.fn);
    
    const welcomeRef = useRef<HTMLHeadingElement>(null);
    const welcomeOnScreen = useElementOnScreen(welcomeRef);    
    
    const favTitleRef = useRef<HTMLHeadingElement>(null);
    const isFavTitleOnScreen = useElementOnScreen(favTitleRef);
    
    const cartTitleRef = useRef<HTMLHeadingElement>(null);
    const isCartTitleOnScreen = useElementOnScreen(cartTitleRef);    

    const historyTitleRef = useRef<HTMLHeadingElement>(null);
    const isHistoryTitleOnScreen = useElementOnScreen(historyTitleRef);    

    return (
        <div className={styles.main}>
            <h1 ref={welcomeRef} className={styles.title + (welcomeOnScreen ? ` ${styles.show}` : '')}>{`Welcome back, ${fn}`}</h1>
            <div className={styles.iconTitlePair}>
                <span className={styles.iconContainer}>
                    <HeartIcon />
                </span>
                <h2 ref={favTitleRef} className={styles.title + (isFavTitleOnScreen ? ` ${styles.show}` : '')}>
                    Your favorites
                </h2>
            </div>
            <FavDisplayer />
            <div className={styles.iconTitlePair}>
                <span className={styles.iconContainer}>
                    <CartIcon />
                </span>
                <h2 ref={cartTitleRef} className={styles.title + (isCartTitleOnScreen ? ` ${styles.show}` : '')}>
                    Your cart
                </h2>
            </div>
            <Cart />
            <div className={styles.iconTitlePair}>
                <span className={styles.iconContainer}>
                    <HistoryIcon />
                </span>
                <h2 ref={historyTitleRef} className={styles.title + (isHistoryTitleOnScreen ? ` ${styles.show}` : '')}>
                    Order History
                </h2>
            </div>
            <OrderHistory />
        </div>
    );
}

export default DashboardPage;