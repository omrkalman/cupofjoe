import { Fragment, useRef, useState } from "react";
import { unlock } from '../../api/auth';
import styles from './UnlockPanel.module.css';
import validate from "../../validation/schemas";
import { Status } from "../../types/types";

const initialState = { success: false, msg: '' };

const UnlockPanel = () => {
    
    const [using, setUsing] = useState<['iduser' | 'email' | 'phone', string]>(['iduser', '']);

    const [result, setResult] = useState<Status>(initialState);

    const [validity, setValidity] = useState<Status>(initialState);
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    const iduserCheckboxRef = useRef<HTMLInputElement>(null);
    const emailCheckboxRef = useRef<HTMLInputElement>(null);
    const phoneCheckboxRef = useRef<HTMLInputElement>(null);
    
    const usingHandler: React.ChangeEventHandler<HTMLInputElement> = (ev) => {            
        setResult(initialState);
        setValidity(initialState);
        setValidity
        setUsing((prev) => {
            prev[0] = ev.target.value as 'iduser' | 'email' | 'phone'
            return prev;
        });  
        iduserCheckboxRef.current!.checked = (ev.target.value === 'iduser');
        emailCheckboxRef.current!.checked = (ev.target.value === 'email');
        phoneCheckboxRef.current!.checked = (ev.target.value === 'phone');
    }

    const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        setResult(initialState);
        setUsing((prev) => {
            prev[1] = ev.target.value;
            return prev;
        })
    }

    const doValidation = () => {
        const validation = validate(using[0], inputRef.current!.value);
        if (validation.error) {
            setValidity({ success: false, msg: validation.error.message });
            return false;
        }
        // else
        return true;
    }

    const unlockHandler = () => {
        if (!doValidation()) return; 
        //else
        setValidity(initialState);
        unlock(Object.fromEntries([using])).then(({ data }) => {
            setResult({
                success: true,
                msg: data.body.msg
            });
        }).catch((error) => {
            setResult({
                success: false,
                msg: (error?.response?.data?.body?.msg.join() || "Couldn't unlock.")
            });
        })
    }

    return <Fragment>
        <h4>Unlock using:</h4>
        <input type="checkbox" ref={iduserCheckboxRef} defaultChecked value='iduser' onChange={usingHandler} />{` iduser `}
        <input type="checkbox" ref={emailCheckboxRef} value='email' onChange={usingHandler} />{` email `}
        <input type="checkbox" ref={phoneCheckboxRef} value='phone' onChange={usingHandler} /> phone
        <hr />
        <input className={styles.normalize} ref={inputRef} onChange={inputChangeHandler} type="text" />
        <button className={styles.normalize} onClick={unlockHandler}>Unlock</button>
        {!!validity.msg && <p className={styles.msg +' '+ (validity.success ? styles.valid : styles.invalid)}>{validity.msg}</p>}
        {!!result.msg && <p className={styles.msg +' '+ (result.success ? styles.valid : styles.invalid)}>{result.msg}</p>}
    </Fragment>
}

export default UnlockPanel;