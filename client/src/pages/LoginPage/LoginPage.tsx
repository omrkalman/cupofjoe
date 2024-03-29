import { useCallback, useEffect, useState } from "react";
import styles from './LoginPage.module.css';
import { NavLink, useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routes";
import validate from '../../validation/schemas';
import useLogin from "../../hooks/uselogin";

const LoginPage = () => {
    const [inputValues, setInputValues] = useState({
        email: '',
        pw: ''
    });

    const [formValid, setFormValid] = useState(false);

    const [failure, setFailure] = useState('');

    const login = useLogin();

    const inputChangeHandler = useCallback((ev: React.ChangeEvent<HTMLInputElement> | Array<React.ChangeEvent<HTMLInputElement>>) => {

        let update, updated;

        if (Array.isArray(ev)) update = Object.fromEntries(ev.map(e => [ [e.target.name], e.target.value ]));
        else update = {[ev.target.name]: ev.target.value};

        updated = {...inputValues, ...update};

        setInputValues(updated);
        
        const validation = validate('login', updated);
        if (validation.error) {
            setFormValid(false);
        } else {
            setFormValid(true);
        }

    }, [inputValues]);

    useEffect(() => {
        const events = [
            { target: { name: 'email', value: 'guest@example.com' }},
            { target: { name: 'pw', value: 'Guest12345%' }}
        ];
        inputChangeHandler(events as Array<React.ChangeEvent<HTMLInputElement>>);
    }, [])

    const navigate = useNavigate();
    const submitHandler = useCallback((ev: React.FormEvent<HTMLFormElement>)=> {
        ev.preventDefault();
        login(inputValues).then(_ => {
            navigate(ROUTES.HomePage);
        }).catch((error) => {
            setInputValues(prev => ({ ...prev, pw: '' }));
            setFormValid(false);
            setFailure(error);
        })
    }, [inputValues]);

    return (
        <div className={styles.main}>
            <form className={styles.form} onSubmit={submitHandler}>
                <input  
                    type="text" name='email' value={inputValues.email} placeholder='email' 
                    className={styles.input} onChange={inputChangeHandler} />
                <input 
                    type="password" name='pw' value={inputValues.pw} placeholder='password' 
                    className={styles.input} onChange={inputChangeHandler} />
                <button disabled={!formValid} className={styles.input} type='submit'>
                    Log in
                </button>
                {failure && <p className={styles.failureMessage}>{failure}</p>}
                <p className={styles.signup}>Don't have an account yet? <NavLink to={ROUTES.SignupPage}>sign up</NavLink></p>
            </form>
        </div>
    );
}

export default LoginPage;