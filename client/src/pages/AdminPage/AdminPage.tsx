import { useState } from 'react';
import UnlockPanel from '../../components/UnlockPanel/UnlockPanel';
import UnhidePanel from '../../components/UnhidePanel/UnhidePanel';
import NewProduct from '../../components/NewProduct/NewProduct';
import RestockPanel from '../../components/RestockPanel/RestockPanel';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    
    const [functionality, setFunctionality] = useState<number>(1);
    
    
    const functionalityHandler: React.ChangeEventHandler<HTMLSelectElement> = (ev) => {
        setFunctionality(+ev.currentTarget.value);
    }

    return (
        <div className={styles.main}>
            <select className={styles.controls} onChange={functionalityHandler}>
                <option value={1}>Unlock a user</option>
                <option value={2}>Unhide a product</option>
                <option value={3}>Delete a product</option>
                <option value={4}>Add a new product</option>
                <option value={5}>Add stock to products</option>
            </select>
            {(functionality === 1) && <UnlockPanel />}
            {(functionality === 2) && <UnhidePanel />}
            {(functionality === 3) && <UnhidePanel isDelete={true} />}
            {(functionality === 4) && <NewProduct />}
            {(functionality === 5) && <RestockPanel />}
        </div>
    )
}

export default AdminPage;