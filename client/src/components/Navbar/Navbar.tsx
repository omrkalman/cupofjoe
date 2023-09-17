import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Fragment, useCallback, useRef, useState } from "react";
import { visualActions } from "../../store/visual";
import { filtersActions } from "../../store/filters";
import scrollToTargetHandler from '../../handlers/scrollToTarget';
import ROUTES from '../../routes/routes';
import { Category, ProductFilters } from "../../types/types";
import Switch from "../../partials/Switch";
import styles from './Navbar.module.css';
import { userActions } from "../../store/user";
import { favsActions } from "../../store/favs";

const navLinks: Array<{children: string, to: string, isAuth?: boolean, isAdmin?: boolean}> = [
    {
        children: 'Home',
        to: ROUTES.HomePage,
        isAuth: true
    },
    {
        children: 'Shop',
        to: ROUTES.ShopPage
    },
    {
        children: 'Log out',
        to: ROUTES.LoginPage,
        isAuth: true
    },
    {
        children: 'Profile',
        to: ROUTES.ProfilePage,
        isAuth: true
    },
    {
        children: 'Log in',
        to: ROUTES.LoginPage,
        isAuth: false
    },
    {
        children: 'Sign up',
        to: ROUTES.SignupPage,
        isAuth: false
    },
    {
        children: 'Admin',
        to: ROUTES.AdminPage,
        isAuth: true,
        isAdmin: true
    }
];

const cardModeButtons: Array<{children: string, category: Category}> = [
    {
        children: 'Machines',
        category: 'machines'
    },
    {
        children: 'Beans',
        category: 'beans'
    },
    {
        children: 'Capsules',
        category: 'capsules'
    }
];

const Navbar = () => {

    const isCurrentlyDark = useSelector((state: any) => state.visual.isDarkMode);
    const {isShop, isCardMode, glowingCategory} = useSelector((state: any) => state.visual.shop);
    const { isAuth, isAdmin } = useSelector((state: any) => state.user);
    const filters = useSelector((state: {filters: ProductFilters}) => state.filters);

    const nameRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const minRef = useRef<HTMLInputElement>(null);
    const maxRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();

    const [isDescSort, setIsDescSort] = useState(true);

    const dispatchFilters = useCallback(() => {
        const category = categoryRef.current?.value;
        const name = nameRef.current?.value;
        const min = minRef.current?.value;
        const max = maxRef.current?.value;
        const sort = isDescSort ? 'desc' : 'asc';
        dispatch(filtersActions.resetPage());
        dispatch(filtersActions.set({ category, name, min, max, sort }));
    }, [isDescSort]);

    const flipSort = useCallback(() => {
        setIsDescSort(prev => !prev)
    }, []);

    const viewTogglerHandler = useCallback(() => {
        dispatch(visualActions.toggleShopMode());
    }, []); 

    const modeTogglerHandler = useCallback(() => {
        dispatch(visualActions.toggleDarkMode());
    }, []);

    const logoutHandler: React.MouseEventHandler = useCallback(() => {
        dispatch(userActions.reset());
        dispatch(favsActions.reset());
        localStorage.removeItem('token');
    }, []);
    
    return ( 
        <div className={styles.navbarContainer}>
            <div className={styles.navbar}>

                <div className={styles.navbarMain}>
                    {navLinks.filter(nl => (nl.isAuth === undefined)).map(nl => (
                        <NavLink
                            key={Math.floor(Math.random() * 10E6)}
                            to={nl.to}                        
                            className={styles.navlink}>
                            {nl.children}
                        </NavLink>
                    ))}
                    {!isAuth &&
                        navLinks.filter(nl => (nl.isAuth === false)).map(nl => (
                            <NavLink
                                key={Math.floor(Math.random() * 10E6)}
                                to={nl.to}                        
                                className={styles.navlink}>
                                {nl.children}
                            </NavLink>
                        ))
                    }
                    {isAuth &&
                        navLinks.filter(nl => ((nl.isAuth === true) && !nl.isAdmin)).map(nl => (
                            <NavLink
                                key={Math.floor(Math.random() * 10E6)}
                                onClick={((nl.children === 'Log out') ? logoutHandler : undefined)}                        
                                to={nl.to}
                                className={styles.navlink}>
                                {nl.children}
                            </NavLink>
                        ))
                    }
                    {isAdmin && 
                        navLinks.filter(nl => nl.isAdmin).map(nl => (
                            <NavLink
                                key={Math.floor(Math.random() * 10E6)}
                                to={nl.to}                        
                                className={styles.navlink}>
                                {nl.children}
                            </NavLink>
                        ))
                    }
                </div>

                <div className={styles.aside}>
                    <span>☀️</span>
                    <Switch condition={isCurrentlyDark} onChange={modeTogglerHandler}></Switch>
                    <span>🌙</span>
                </div>
            </div>

            {isShop &&
                <div className={styles.navbar}>

                    <div className={styles.navbarMain}>
                        {isCardMode &&
                            <Fragment>
                                {cardModeButtons.map(item => (
                                    <button
                                    key={Math.floor(Math.random() * 10E6)}
                                    className={styles.navlink + (glowingCategory === item.category ? ' active' : '')}
                                    name={item.category}
                                    onClick={scrollToTargetHandler}>
                                        {item.children}
                                    </button>
                                ))}
                            </Fragment>
                        }

                        {!isCardMode &&
                            <Fragment>
                                <input type="text" ref={nameRef} className={styles.navlink} defaultValue={filters.name} placeholder="Search🔍" onBlur={dispatchFilters} />
                                <select ref={categoryRef} className={styles.navlink +' '+ styles.open} defaultValue={filters.category} onChange={dispatchFilters}>
                                    <option value="">All</option>
                                    <option value="beans">Beans</option>
                                    <option value="capsules">Capsules</option>
                                    <option value="machines">Machines</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className={styles.navlink +' '+ styles.priceFilters} onClick={(ev: any) => ev.target.classList.add(styles.open)} onMouseLeave={(ev: any) => ev.target.classList.remove(styles.open)}>
                                    Price
                                    <div>
                                        <label htmlFor='minFilter'>min:</label>
                                        <input type="number" ref={minRef} defaultValue={filters.min} min={0} id='minFilter' />
                                    </div>
                                    <div>
                                        <label htmlFor='maxFilter'>max:</label>
                                        <input type="number" ref={maxRef} defaultValue={filters.max} min={0} id='maxFilter' />
                                    </div>
                                    <div>
                                        lo <Switch condition={isDescSort} onChange={flipSort} /> hi
                                    </div>
                                    <button type='button' onClick={dispatchFilters}>Apply</button>
                                </div>

                            </Fragment>
                        }
                    </div>

                    <div className={styles.aside}>
                        <span>📜</span>
                        <Switch condition={isCardMode} onChange={viewTogglerHandler} />
                        <span>🖼️</span>
                    </div>
                </div>
            }
            <div className={styles.shadow} />
        </div>   
    );
}

export default Navbar;