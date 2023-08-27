import { Fragment, useState } from 'react';
import { Category, EditableProductField } from '../../types/types';
import { add, uploadImage } from '../../api/product';
import styles from './NewProduct.module.css';
import { Status } from '../../types/types';
import validate from '../../validation/schemas';

const NewProduct = () => {

    const [values, setValues] = useState<{
        name: string,
        price: number,
        category: Category,
        stock: number,
        desc?: string,
        hide?: 0 | 1
    }>({
        name: '',
        price: 0,
        category: '',
        stock: 0,
        desc: '',
        hide: 0
    });

    const [validity, setValidity] = useState<{
        [K in EditableProductField]?: Status
    }>({
        name: { success: false, msg: '' },
        price: { success: false, msg: '' },
        category: { success: false, msg: '' },
        stock: { success: false, msg: '' },
        desc: { success: true, msg: 'Good' },
        hide: { success: true, msg: 'Good' }
    });

    const [result, setResult] = useState({ success: false, msg: '' });
    
    const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (ev) => {
        setValues((prev) => ({ ...prev, [ev.target.name]: ev.target.value }));
        const validation = validate(ev.target.name as EditableProductField , ev.target.value);
        if (validation.error) setValidity((prev) => ({ ...prev, [ev.target.name]: { success: false, msg: validation.error.message } }));
        else setValidity((prev) => ({ ...prev, [ev.target.name]: { success: true, msg: 'Good' } }));
    }

    const addProductHandler = () => {
        let clone = structuredClone(values);
        if (!values.desc) delete clone.desc;
        if (!values.hide) delete clone.hide;
        add(clone).then(({ data}) => {
            setResult({ success: true, msg: data.body.msg });
        }).catch((error) => {
            setResult({ success: false, msg: (error?.response?.data?.body?.msg.join() || "Couldn't add product.") });
        })
    }

    const [file, setFile] = useState<File>();

    const [fileName, setFileName] = useState('');

    const fileChangeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files) {
            setFile(ev.target.files[0]);
        }
    };

    const uploadHandler: React.FormEventHandler = (ev) => {
        ev.preventDefault();
        if (!file) return;
        //else
        const config = {
            headers: {
              'content-type': file.type,
              'content-length': ''+file.size,
            }
        }
        uploadImage(file, config).then(({ data }) => {
            console.log('data.body', data.body);
            setFileName(data.body.fileName);
        }).catch((error) => {
            console.error(error);
        })
    }

    return (<Fragment>
        <form className={styles.main}>
            
            <div className={styles.inputContainer}>
                <span>Name: </span>
                <input onChange={inputChangeHandler} name='name' type="text" />
                {(!!(validity.name?.msg)) && 
                    <p className={styles.msg +' '+ (validity.name.success ? styles.valid : styles.invalid)}>{validity.name.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <span>Price: </span>
                <input onChange={inputChangeHandler} name='price' type="text" />
                {(!!(validity.price?.msg)) && 
                    <p className={styles.msg +' '+ (validity.price.success ? styles.valid : styles.invalid)}>{validity.price.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <span>Category: </span>
                <input onChange={inputChangeHandler} name='category' type="text" />
                {(!!(validity.category?.msg)) && 
                    <p className={styles.msg +' '+ (validity.category.success ? styles.valid : styles.invalid)}>{validity.category.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <span>Stock: </span>
                <input onChange={inputChangeHandler} name='stock' type="text" />
                {(!!(validity.stock?.msg)) && 
                    <p className={styles.msg +' '+ (validity.stock.success ? styles.valid : styles.invalid)}>{validity.stock.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <span>Description: </span>
                <textarea onChange={inputChangeHandler} name='desc' />
                {(!!(validity.desc?.msg)) && 
                    <p className={styles.msg +' '+ (validity.desc.success ? styles.valid : styles.invalid)}>{validity.desc.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <span>Hide: </span>
                <input defaultValue={0} onChange={inputChangeHandler} name='hide' type="text" />
                {(!!(validity.hide?.msg)) && 
                    <p className={styles.msg +' '+ (validity.hide.success ? styles.valid : styles.invalid)}>{validity.hide.msg}</p>
                }
            </div>
            <div className={styles.inputContainer}>
                <input type="file" name='product_image' onChange={fileChangeHandler} />
                <div>{file && `${file.name} - ${file.type}`}</div>
                <button onClick={uploadHandler}>Upload</button>
            </div>
        </form>
        {Object.values(validity).every((item) => (item.success)) && 
            <button className={styles.submit} onClick={addProductHandler}>Add product</button>
        }
        {!!result.msg && <p className={styles.msg +' '+ styles.result +' '+ (result.success ? styles.valid : styles.invalid)}>{result.msg}</p> }
    </Fragment>)
}

export default NewProduct;