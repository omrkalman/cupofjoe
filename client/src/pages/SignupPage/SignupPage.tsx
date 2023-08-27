import { useCallback, useState } from "react";
import styles from './SignupPage.module.css';
import { NavLink, useNavigate } from "react-router-dom";
import ROUTES from "../../routes/routes";
import validate from '../../validation/schemas';
import { EditableUserField } from "../../types/types";
import useSignup from "../../hooks/useSignup";

const initialState = {
    email: '',
    pw: '',
    phone: '',
    fn: '',
    ln: '',
    city: '',
    address: ''
};

const SignupPage = () => {
    const [inputValues, setInputValues] = useState(initialState);

    const [validity, setValidity] = useState(initialState);

    const [failure, setFailure] = useState('');

    const signup = useSignup();

    const inputChangeHandler = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {

        const update = {[ev.target.name]: ev.target.value};
        const updated = {...inputValues, ...update};

        setInputValues(updated);
       
        const validation = validate(ev.target.name as EditableUserField, ev.target.value);

        if (validation.error) {
            setValidity(prev => ({...prev, [ev.target.name]: validation.error.message}))
        } else {
            setValidity(prev => ({...prev, [ev.target.name]: 'Good'}));
        }

    }, [inputValues]);

    const navigate = useNavigate();
    const submitHandler = useCallback((ev: React.FormEvent<HTMLFormElement>)=> {
        ev.preventDefault();
        signup(inputValues).then(_ => {
            navigate(ROUTES.LoginPage);
        }).catch((error: { msg: string[], fields: EditableUserField[] }) => {
            if (!error.fields[0]) setValidity(initialState);
            else setValidity((prev) => ({ ...prev, ...Object.fromEntries(error.fields.map((f) => [f,'See below'])) }))
            setFailure(error.msg.join('\n'));
        })
    }, [inputValues]);

    return (
        <div className={styles.main}>
            <form className={styles.form} onSubmit={submitHandler}>
                <input  
                    type="text" name='email' value={inputValues.email} placeholder='email' 
                    className={styles.input +' '+ styles.emailInput} onChange={inputChangeHandler} />
                {validity.email && 
                    <p className={styles.emailMessage + ((validity.email === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.email}
                    </p>
                }
                <input 
                    type="password" name='pw' value={inputValues.pw} placeholder='password' 
                    className={styles.input +' '+ styles.pwInput} onChange={inputChangeHandler} />
                {validity.pw && 
                    <p className={styles.pwMessage + ((validity.pw === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.pw}
                    </p>
                }
                <input 
                    type="text" name='phone' value={inputValues.phone} placeholder='phone' 
                    className={styles.input +' '+ styles.phoneInput} onChange={inputChangeHandler} />
                {validity.phone && 
                    <p className={styles.phoneMessage + ((validity.phone === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.phone}
                    </p>
                }
                <input 
                    type="text" name='fn' value={inputValues.fn} placeholder='first name' 
                    className={styles.input +' '+ styles.fnInput} onChange={inputChangeHandler} />
                {validity.fn && 
                    <p className={styles.fnMessage + ((validity.fn === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.fn}
                    </p>
                }
                <input 
                    type="text" name='ln' value={inputValues.ln} placeholder='last name' 
                    className={styles.input +' '+ styles.lnInput} onChange={inputChangeHandler} />
                {validity.ln && 
                    <p className={styles.lnMessage + ((validity.ln === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.ln}
                    </p>
                }
                <input 
                    type="text" name='city' value={inputValues.city} placeholder='city' 
                    className={styles.input +' '+ styles.cityInput} onChange={inputChangeHandler} />
                {validity.city && 
                    <p className={styles.cityMessage + ((validity.city === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.city}
                    </p>
                }
                <input 
                    type="text" name='address' value={inputValues.address} placeholder='address' 
                    className={styles.input +' '+ styles.addressInput} onChange={inputChangeHandler} />
                {validity.address && 
                    <p className={styles.addressMessage + ((validity.address === 'Good') ? ` ${styles.goodMessage}` : ` ${styles.warningMessage}`)}>
                        {validity.address}
                    </p>
                }
                <button disabled={!Object.values(validity).every(i => (i === 'Good'))} className={styles.input +' '+ styles.submitInput} type='submit'>
                    Sign up
                </button>
                {failure && <p className={styles.warningMessage +' '+ styles.failureMessage}>{failure}</p>}
                <p className={styles.signup +' '+ styles.alreadyMessage}>Already have an account? <NavLink to={ROUTES.LoginPage}>log in</NavLink></p>
            </form>
        </div>
    );
} 

export default SignupPage;