import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { unhide, deleteProduct } from "../../api/product";
import useProducts from "../../hooks/useProducts";
import { Product, Status } from "../../types/types";
import styles from './UnhidePanel.module.css';
import Price from "../../partials/Price";
import validate from "../../validation/schemas";

const initialState = { success: false, msg: '' };

const UnhidePanel = ({ isDelete }: { isDelete?: boolean }) => {
    
    const [validity, setValidity] = useState<Status>(initialState);
    
    const [result, setResult] = useState<Status>(initialState);

    const [products, setProducts] = useState<Product[]>([]);
    
    const [isMore, setIsMore] = useState(false);
    
    const [page, setPage] = useState(1);

    const inputRef = useRef<HTMLInputElement>(null);

    const populate = useProducts();

    useEffect(() => {
        loadProducts(true);
    }, []);

    const loadProducts = (isRefresh?: boolean) => {
        populate(setProducts, setIsMore, { hide: 1, page: (isRefresh ? 1 : page+1) });
        if (isRefresh) setPage(1);
        else setPage(page + 1);
    }

    const productClickHandler: React.MouseEventHandler<HTMLDivElement> = (ev) => {
        setResult(initialState);
        setValidity(initialState);
        inputRef.current!.value = ev.currentTarget.id.replace('UnhidePanel','');
    }

    const doValidation = () => {
        setResult(initialState);
        const validation = validate('idproduct', inputRef.current!.value);
        if (validation.error) {
            setValidity({ success: false, msg: validation.error.message });
            return false
        }
        // else {
        return true;
    }

    const unhideHandler = () => {
        if (!doValidation()) return; 
        //else
        setValidity(initialState);
        unhide(+inputRef.current!.value).then(({ data }) => {
            setResult({
                success: true,
                msg: data.body.msg
            });
            loadProducts(true);
        }).catch((error) => {
            setResult({
                success: false,
                msg: (error?.response?.data?.body?.msg.join() || "Couldn't unlock.")
            });
        })
    }

    const deleteHandler = () => {
        if (!doValidation()) return; 
        //else
        setValidity(initialState);
        deleteProduct(+inputRef.current!.value).then(({ data }) => {
            setResult({
                success: true,
                msg: data.body.msg
            });
            loadProducts(true);
        }).catch((error) => {
            setResult({
                success: false,
                msg: (error?.response?.data?.body?.msg.join() || "Couldn't delete.")
            });
        })
    }

    return <Fragment>
        <section className={styles.container}>
            {products.map((p) => (
                <div key={Math.ceil(Math.random()*10E6)} id={'UnhidePanel'+p.idproduct} onClick={productClickHandler} className={styles.product}>
                    <h5 className={styles.detail}>{p.name}</h5>
                    <h6 className={styles.detail +' '+ styles.price}>{p.category}</h6>
                    <p className={styles.detail +' '+ styles.price}><Price amount={''+p.price} currency='nis' category={p.category} /></p>
                    <hr />
                    <p className={styles.detail}>{p.desc}</p>
                </div>
            ))}
            {isMore && 
                <div className={styles.product} onClick={() => {loadProducts()}}>
                    <div className={styles.loadMoreDiv}>
                        <button>+</button>
                    </div>
                </div>
            }
        </section>
        <hr />
        <input ref={inputRef} className={styles.input} type="number" />
        <button className={styles.input} onClick={isDelete ? deleteHandler : unhideHandler}>{isDelete ? 'Delete' : 'Unhide'}</button>
        {!!validity.msg && <p className={styles.msg +' '+ (validity.success ? styles.valid : styles.invalid)}>{validity.msg}</p>}
        {!!result.msg && <p className={styles.msg +' '+ (result.success ? styles.valid : styles.invalid)}>{result.msg}</p>}
    </Fragment>
}

export default UnhidePanel;