import { useEffect } from 'react';
import styles from './ShopPage.module.css';
import Explorer from '../../components/Explorer/Explorer';
import SwitchingTitle from '../../partials/SwitchingTitle';
import { useDispatch, useSelector } from 'react-redux';
import { visualActions } from '../../store/visual';
import { filtersActions } from '../../store/filters';
import ProductList from '../../components/ProductList/ProductList';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"

const ShopPage = () => {
    const dispatch = useDispatch();

    const { isCardMode } = useSelector((state: any) => state.visual.shop);

    const favs = useSelector((state: any) => state.favs);
    
    useEffect(()=> {
        dispatch(visualActions.activateShop());
        
        const timeout = setTimeout(() => {
            Toastify({
                text: "Don't forget to try list view →",
                duration: 3000,
                offset: {
                    x: 100,
                    y: 0
                }
              }).showToast();
        }, 3000);

        return ()=> {
            dispatch(visualActions.deactivateShop());
            dispatch(filtersActions.resetPage());
            clearTimeout(timeout)
        }
    }, []);
   
    if (isCardMode) {
        return <div className={styles.main}>
            <SwitchingTitle />
            <Explorer id='machines' key='machines' category='machines' slogan="Matchin' your expectations" favs={favs} />
            <Explorer id='beans' key='beans' category='beans' slogan='They have bean waiting for you' favs={favs} />
            <Explorer id='capsules' key='capsules' category='capsules' slogan='Encapsulate Your Dreams' favs={favs} />
        </div>
    } // else{
    return <div className={styles.main}>
        <ProductList />
    </div>
}

export default ShopPage;