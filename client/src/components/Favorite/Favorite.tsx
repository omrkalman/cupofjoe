import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../../types/types";
import { getImageUrl } from "../../api/images";
import useCacheOrProduct from "../../hooks/useCacheOrProduct";
import useElementOnScreen from "../../hooks/useElementOnScreen";
import Loading from "../../partials/Loading";
import styles from './Favorite.module.css';

const Favorite = ({ idproduct }: { idproduct: number }) => {
    
    const [product, setProduct] = useState<Product>();
    const [isPreviouslySeen, setIsPreviouslySeen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const onScreen = useElementOnScreen(containerRef);

    const navigate = useNavigate();

    const productify = useCacheOrProduct();
    
    useEffect(() => {
        if (onScreen && !isPreviouslySeen) {
            setIsPreviouslySeen(true);
            productify(idproduct).then((product) => {
                setProduct(product);
            })
        }
    }, [onScreen]);

    return (
        <div ref={containerRef} onClick={() => navigate(`/product/${idproduct}`)} className={styles.container + (!product ? ` ${styles.loading}` : ` ${styles.loaded}`)}>
            {!!product && 
                <img src={getImageUrl(product.img)} alt="pic of product" />
            }
            <div className={styles.info}>
                {!!product &&
                    <p>{product.name}</p>
                }
                {!product &&
                    <Loading />
                }
            </div>
        </div>
    )
}

export default Favorite;