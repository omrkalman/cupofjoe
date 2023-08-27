import { Fragment, useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFav, removeFav } from '../../api/fav';
import { EditableProductField, Product, Status } from '../../types/types';
import { getImageUrl } from '../../api/images';
import { favsActions } from '../../store/favs';
import { edit } from '../../api/product';
import useCacheOrProduct from '../../hooks/useCacheOrProduct';
import CircularButton from '../../components/CircularButton/CircularButton';
import Loading from '../../partials/Loading';
import CartIcon from '../../partials/CartIcon';
import HeartIcon from '../../partials/HeartIcon';
// import BoxIcon from '../../partials/BoxIcon';
import Price from '../../partials/Price';
import ROUTES from '../../routes/routes';
import validate from '../../validation/schemas';
import styles from './ProductPage.module.css';

const ProductPage = () => {
    
    const idproduct = parseInt(useParams().id || '');

    const { isAuth, iduser, isAdmin } = useSelector((state: any) => state.user);

    const favs: number[] = useSelector((state: any) => state.favs);

    const [product, setProduct] = useState<Product>({ idproduct: 0, name: '', price: '', category: '', stock: 0, desc: '', img: '' });
    
    const [favMsg, setFavMsg] = useState('');

    const [cartQty, setCartQty] = useState(0);

    const isFav = useMemo(() => favs.includes(idproduct), [favs, idproduct]);

    const productify = useCacheOrProduct();

    useEffect(()=> {
        if (idproduct) {
            productify(idproduct).then((product) => {
                setProduct(product);
            }).catch((error) => {
                console.error(error?.response?.data?.body?.msg.join() || 'Error occured');
            });
        }
    }, []);

    useEffect(()=> {
        if (isFav) setFavMsg('Added to favorites');
        else setFavMsg('Add to favorites');
    }, [isFav]);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const cartHandler = useCallback(() => {
        if (!isAuth) {
            navigate(ROUTES.LoginPage);
            return;
        }

        const cart: Array<{ idproduct: number, qty: number }> = JSON.parse(localStorage.getItem(`cart-${iduser}`) || '[]');
        const inCart = cart.find((item) => item.idproduct === idproduct);
        
        if (inCart) {
            inCart.qty++;
            setCartQty(inCart.qty);
            localStorage.setItem(`cart-${iduser}`, JSON.stringify(cart));
        } else {
            setCartQty(1);
            localStorage.setItem(`cart-${iduser}`, JSON.stringify([...cart, { idproduct, qty:1 }]));
        }
    }, []);

    const favHandler = useCallback(() => {
        if (!isAuth) {
            navigate(ROUTES.LoginPage);
            return;
        }
        if (isFav) {
            removeFav(product.idproduct).then(() => {
                dispatch(favsActions.remove(product.idproduct));
            }).catch((error) => {
                console.error(error);
                setFavMsg('Error occured');
            });
        } else {
            addFav({ idproduct: product.idproduct }).then(() => {
                dispatch(favsActions.add(product.idproduct));
            }).catch((error) => {
                console.error(error);
                setFavMsg('Error occured');
            });
        }
    }, [product, isFav]);

    
    const backHandler = useCallback(() => {
        navigate(-1);
    }, []);

    const [newValue, setNewValue] = useState<[EditableProductField | '', string, string?]>(['', '']);
    const [validity, setValidity] = useState<Status>({ success: false, msg: '' });
    const [result, setResult] = useState<Status>({ success: false, msg: '' });

    const editClickHandler = useCallback(
        (ev: React.MouseEvent<HTMLButtonElement> & {target:{name:EditableProductField, title:string}}) => {
            if (ev.target.title) setNewValue([ev.target.name, '', ev.target.title]); 
            else setNewValue([ev.target.name, '']);
            setValidity({ success: false, msg: '' });
            setResult({ success: false, msg: '' });
        }, 
    []);

    const inputChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback((ev) => {
        let clone: [EditableProductField, string] = structuredClone(newValue);
        clone[1] = ev.target.value;
        setNewValue(clone);
        setResult({ success: false, msg: '' });
        const validation = validate(...clone);
        if (validation.error) setValidity({ success: false, msg: validation.error.message });
        else setValidity({ success: true, msg: 'Good' });
    }, [newValue]);

    const saveClickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
        setValidity({ success: false, msg: '' });
        edit({ idproduct, values: { [newValue[0]]: newValue[1] } }).then(({ data }) => {
            setResult({ success: true, msg: data.body.msg });
            sessionStorage.removeItem(''+idproduct);
        }).catch((error: any) => {
            setResult({ success: false, msg: (error?.response?.data?.body?.msg.join() || "Couldn't make the change.")});
        });
    }, [newValue]);

    const reset = useCallback(() => {
        if (!idproduct) return;
        productify(idproduct).then((product) => {
            setProduct(product);
        }).catch((error) => {
            console.error(error?.response?.data?.body?.msg.join() || 'Error occured');
        });
        setNewValue(['', '']);
        
        setValidity({ success: false, msg: '' });
        setResult({ success: false, msg: '' });
        
        
    }, []);

    return ( 
        <div className={styles.main}>
            <button className={styles.backBtn} onClick={backHandler}>⤣</button>
            {!!product.name && 
                <h1>
                    {product.name}
                    {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='name'>✏️</button>}
                </h1>
            }
            {!product.name && <div style={{textAlign: 'center'}}><Loading /></div>}
            <h6>
                {product.category}
                {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='category'>✏️</button>}
            </h6>
            <div className={styles.container}>
                {!!product.img && <img src={getImageUrl(product.img)} alt='pic of product' />}
                {!product.img && <Loading />}
                <section>
                    {isAdmin && !!idproduct && <p className={styles.detail}>
                        {`idproduct ${idproduct}`}
                    </p>}
                    {(!!product.desc || isAdmin) && <p className={styles.detail}>
                        {product.desc || 'No desc'}
                        {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='desc' title="description">✏️</button>}
                    </p>}
                    {!!product.stock && <p className={styles.detail}>
                        {product.stock} in stock
                        {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='stock'>✏️</button>}
                    </p>}
                    {(isAdmin) && (product.hide !== undefined) && <p className={styles.detail}>
                        {`Hide (0 = not hidden, 1 = hidden): ${product.hide}`}
                        {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='hide'>✏️</button>}
                    </p>}
                    {!!product.price && <p className={styles.detail}>
                        <Price amount={product.price} currency='nis' category={product.category} />
                        {isAdmin && <button onClick={editClickHandler} className={styles.editBtn} name='price'>✏️</button>}
                    </p>}
                    {!product.price && <Loading />}
                    <div className={styles.options}>
                        <span>
                            <CircularButton onClick={cartHandler} color1='white' color2={cartQty ? 'green' : '#509eeb'} icon={<CartIcon />} />
                            {cartQty ? ' Added to cart' : ' Add to cart'}
                            {cartQty > 1 && <span className={styles.qty}>
                                {` (x${cartQty})`}
                            </span>}
                        </span>
                        <span>
                            <CircularButton onClick={favHandler} color1={isFav ? 'white' : 'rgb(255, 90, 118)'} color2={isFav ? 'rgb(255, 90, 118)' : 'transparent'} icon={<HeartIcon />} title={isFav ? 'unlike' : 'like'} />
                            {` ${favMsg}`}
                        </span>
                        {/* {isAdmin && <span>
                            <CircularButton onClick={restockHandler} color1='yellow' color2='transparent' icon={<BoxIcon />} title='add stock' />
                            {` Add stock `}
                            <input className={styles.restockQty} min={1} type="number" ref={restockInputRef} />
                        </span>} */}
                        
                        
                        
                    </div>
                    {!!newValue[0] &&
                        <div className={styles.newValue}>
                            <label className={styles.label}>{`New ${(newValue[2] || newValue[0])}`}</label>
                            <textarea value={newValue[1]} onChange={inputChangeHandler} />
                            {!!validity.msg &&
                                <p className={styles.msg + (validity.success ? ` ${styles.valid}` : ` ${styles.invalid}`)}>
                                    {validity.msg}
                                </p>
                            }
                            {!!result.msg &&
                                <p className={styles.msg + (result.success ? ` ${styles.valid}` : ` ${styles.invalid}`)}>
                                    {result.msg}
                                </p>
                            }
                            <button disabled={!validity.success} onClick={saveClickHandler}>Save</button>
                            <button disabled={!result.success} onClick={() => {reset();}}>Refresh</button>
                        </div>
                    }
                </section>
            </div>
        </div> 
    );
}

export default ProductPage;