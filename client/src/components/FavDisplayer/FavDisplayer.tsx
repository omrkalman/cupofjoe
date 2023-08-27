import { useRef, useEffect, Fragment, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Favorite from '../Favorite/Favorite';
import { NavLink } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import styles from './FavDisplayer.module.css';

const FavDisplayer = () => {

    const favs: number[] = useSelector((state: any) => state.favs);
    
    const displayerRef = useRef<HTMLDivElement>(null);
    
    const scrollLeftRef = useRef<HTMLDivElement>(null);
    
    const scrollRightRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (scrollLeftRef.current) {
            let interval: number;
            scrollLeftRef.current.addEventListener('mouseover', () => {
                interval = setInterval(() => {
                    displayerRef.current?.scrollBy({ left: -1 });
                }, 0);
            });
            scrollLeftRef.current.addEventListener('mouseout', () => {
                clearInterval(interval);
            });
        }
    }, [scrollLeftRef.current]);

    useEffect(() => {
        if (scrollRightRef.current) {
            let interval: number;
            scrollRightRef.current.addEventListener('mouseover', () => {
                interval = setInterval(() => {
                    displayerRef.current?.scrollBy({ left: 1 });
                }, 0);
            });
            scrollRightRef.current.addEventListener('mouseout', () => {
                clearInterval(interval);
            });
        }
    }, [scrollRightRef.current]);  

    const renderedFavs = useMemo(() => (
        favs.map((p) => (
            <Favorite key={Math.ceil(Math.random() * 10E6)} idproduct={p} />
        ))
    ), [favs]);

    return (
        <div className={styles.container}>
            {(!!favs[0]) && <Fragment>
                <div ref={scrollLeftRef} className={styles.scroller + ' ' + styles.left}></div>
                <div ref={scrollRightRef} className={styles.scroller + ' ' + styles.right}></div>
                <div ref={displayerRef} className={styles.displayer}>
                    {renderedFavs}
                </div>
            </Fragment>}
            {(!favs[0]) && 
                <p className={styles.emptyMsg}>You don't have favorites yet. <NavLink to={ROUTES.ShopPage}>Browse products</NavLink></p>
            }
        </div>
    );
}

export default FavDisplayer;