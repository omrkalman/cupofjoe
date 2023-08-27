import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Product } from '../../types/types';
import { getImageUrl } from '../../api/images';
import { addFav, removeFav } from '../../api/fav';
import { favsActions } from '../../store/favs';
import ROUTES from '../../routes/routes';
import CartIcon from '../../partials/CartIcon';
import HeartIcon from '../../partials/HeartIcon';
import CircularButton from '../CircularButton/CircularButton';
import styles from './ProductCard.module.css';
import Price from '../../partials/Price';


const ProductCard = ({ product, isFav }: { product: Product, isFav: boolean}) => {

    const { isAuth, iduser } = useSelector((state: any) => state.user);

    const [isInCart, setIsInCart] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const clickHandler = useCallback(() => {
        navigate(`/product/${product.idproduct}`);
    }, [product]);

    const favHandler = useCallback((ev: React.MouseEvent) => {
        // to prevent parent's onClick handler
        ev.stopPropagation();

        if (!isAuth) {
            navigate(ROUTES.LoginPage);
            return;
        }
        if (isFav) {
            removeFav(product.idproduct).then(() => {
                dispatch(favsActions.remove(product.idproduct));
            }).catch((error) => {
                console.error(error);
            });
        } else {
            addFav({ idproduct: product.idproduct }).then(() => {
                dispatch(favsActions.add(product.idproduct));
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [product, isFav]);

    const cartHandler = useCallback((ev: React.MouseEvent) => {
        // to prevent parent's onClick handler
        ev.stopPropagation();

        if (!isAuth) {
            navigate(ROUTES.LoginPage);
            return;
        }

        setIsInCart(true);

        const cart: Array<{ idproduct: number, qty: number }> = JSON.parse(localStorage.getItem(`cart-${iduser}`) || '[]');
        const inCart = cart.find((item) => item.idproduct === product.idproduct);

        if (inCart) {
            inCart.qty++;
            localStorage.setItem(`cart-${iduser}`, JSON.stringify(cart));
        } else {
            localStorage.setItem(`cart-${iduser}`, JSON.stringify([...cart, { idproduct: product.idproduct, qty:1 }]));
        }

    }, [iduser]);

    return (
        <div className={styles.container}>
            <div className={styles.card} onClick={clickHandler}>
                <img src={getImageUrl(product.img)} alt='pic' className={styles["card-img"]}></img>
                <div className={styles["card-info"]}>
                    <h4 className={styles["text-title"]}>{product.name}</h4>
                    <p className={styles["text-body"]}>{product.desc}</p>
                </div>
                <div className={styles["card-footer"]}>
                    <Price className={styles.price} currency='nis' amount={product.price} category={product.category} />
                    <CircularButton icon={<HeartIcon />} onClick={favHandler} color1={isFav ? 'white' : 'rgb(255, 90, 118)'} color2={isFav ? 'rgb(255, 90, 118)' : 'transparent'} title={isFav ? 'unlike' : 'like'} />
                    <CircularButton icon={<CartIcon />} onClick={cartHandler} color1='white' color2={isInCart ? 'green' : '#509eeb'} title='Add to cart' />
                </div>
            </div>
        </div>
    );
}

export default ProductCard;