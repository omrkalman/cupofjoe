import styles from './Switch.module.css';
import { forwardRef } from 'react';

const Switch = ({condition, onChange}: {
    condition: boolean,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}) => {
    return (
        <div className={styles["container"]}>
            <label className={styles["switch"]}>
                <input type="checkbox" checked={condition} onChange={onChange} />    
                <div></div>
            </label>
        </div>
    );
};

export default Switch;