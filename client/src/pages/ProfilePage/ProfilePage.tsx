import { useSelector } from 'react-redux';
import { useCallback, useRef, useState } from 'react';
import validate from '../../validation/schemas';
import { edit } from '../../api/auth';
import { EditableUserField, Status } from '../../types/types';
import useUserInfo from '../../hooks/useUserInfo';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    
    const user = useSelector((state: any) => state.user);

    const [newValue, setNewValue] = useState<[EditableUserField | '', string, string?]>(['', '']);

    const [validity, setValidity] = useState<Status>({ success: false, msg: '' });

    const [result, setResult] = useState<Status>({ success: false, msg: '' });

    const editClickHandler = useCallback((ev: React.MouseEvent<HTMLButtonElement> & {target:{name:string}}) => {
        const field: any = document.getElementById(ev.target.name);
        if (field.title) setNewValue([field.headers, '', field.title]);
        else setNewValue([field.headers, '']);
        setValidity({ success: false, msg: '' });
        setResult({ success: false, msg: '' });
    }, []);
    
    const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
        let clone: [EditableUserField, string] = structuredClone(newValue);
        clone[1] = ev.target.value;
        setNewValue(clone);
        setResult({ success: false, msg: '' });
        const validation = validate(...clone);
        if (validation.error) setValidity({ success: false, msg: validation.error.message });
        else setValidity({ success: true, msg: 'Good' });
    }, [newValue]);

    const saveClickHandler: React.MouseEventHandler<HTMLButtonElement> = useCallback(() => {
        setValidity({ success: false, msg: '' });
        edit({ [newValue[0]]: newValue[1] }).then(({ data }) => {
            setResult({ success: true, msg: data.body.msg });
        }).catch((error: any) => {
            setResult({ success: false, msg: (error?.response?.data?.body?.msg.join() || "Couldn't make the change.")});
        });
    }, [newValue]);

    const userInfo = useUserInfo();

    const refreshClickHandler = useCallback(() => {
        userInfo();
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.tableContainer}>
                <button onClick={refreshClickHandler} className={styles.refreshBtn}>↻</button>
                <table className={styles.table}> 
                    <tbody>
                        <tr>
                            <th className={styles.th}>Email</th>
                            <td id='emailProfile' headers='email'>
                                {user.email}
                                <button onClick={editClickHandler} className={styles.editBtn} name='emailProfile' title="edit"> ✏️</button>
                            </td>
                        </tr>
                        <tr>
                            <th className={styles.th}>Phone</th>
                            <td id='phoneProfile' headers='phone'>
                                {user.phone}
                                <button onClick={editClickHandler} className={styles.editBtn} name='phoneProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                        <tr>
                            <th className={styles.th}>First name</th>
                            <td id='fnProfile' headers='fn' title="first name">
                                {user.fn}
                                <button onClick={editClickHandler} className={styles.editBtn} name='fnProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                        <tr>
                            <th className={styles.th}>Last name</th>
                            <td id='lnProfile' headers='ln' title='last name'>
                                {user.ln}
                                <button onClick={editClickHandler} className={styles.editBtn} name='lnProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                        <tr>
                            <th className={styles.th}>City</th>
                            <td id='cityProfile' headers='city'>
                                {user.city}
                                <button onClick={editClickHandler} className={styles.editBtn} name='cityProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                        <tr>
                            <th className={styles.th}>Address</th>
                            <td id='addressProfile' headers='address'>
                                {user.address}
                                <button onClick={editClickHandler} className={styles.editBtn} name='addressProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                        <tr>
                            <th className={styles.th}>Password</th>
                            <td id='pwProfile' headers='pw' title='password'>
                                ********
                                <button onClick={editClickHandler} className={styles.editBtn} name='pwProfile' title="edit"> ✏️</button>
                            </td>    
                        </tr>
                    </tbody>
                </table>
            </div>
            {!!newValue[0] &&
                <div className={styles.newValue}>
                    <span>{`New ${(newValue[2] || newValue[0])}`}</span>
                    <input type="text" value={newValue[1]} onChange={inputChangeHandler} size={1} onInput={(ev: any)=>{ev.target.size = ((ev.target.value.length || 1) > 16 ? 16 : (ev.target.value.length || 1))}} />
                    <button disabled={!validity.success} onClick={saveClickHandler}>Save</button>
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
                </div>
            }
        </div>
    )
}

export default ProfilePage;