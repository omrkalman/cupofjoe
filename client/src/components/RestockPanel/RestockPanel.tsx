import { Fragment, useEffect, useRef, useState } from "react";
import useProducts from "../../hooks/useProducts";
import { Product, Status } from "../../types/types";
import { restock } from "../../api/product";
import styles from './RestockPanel.module.css';
import validate from "../../validation/schemas";

type Line = { unique: number, idproduct: number, name: string, qty: number };

const initialStatus: Status = { success: false, msg: '' };

const RestockPanel = () => {

    const populate = useProducts();

    const [searchStr, setSearchStr] = useState('');

    const [products, setProducts] = useState<Product[]>([]);

    const [isMore, setIsmore] = useState(true);

    const [lines, setLines] = useState<Line[]>([]);

    const [validity, setValidity] = useState(initialStatus);
    const [result, setResult] = useState(initialStatus);

    const qtyRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        populate(setProducts, setIsmore, { name: searchStr });
    }, [searchStr]);

    const inputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
        setValidity({ success: false, msg: '' });
        // prevent futile queries
        if (!isMore) {
            if (ev.target.value.includes(searchStr)) return;
        }
        //else
        setSearchStr(ev.target.value);
    }

    const writeLineHandler = () => {
        setResult(initialStatus);

        const qtyValidation = validate('stock', +qtyRef.current!.value);

        setValidity({ success: !qtyValidation.error, msg: (qtyValidation.error?.message || '') });

        const idproduct = products.find((p) => (p.name === inputRef.current!.value))?.idproduct;
        
        if (qtyValidation.error || !idproduct) return;
        
        setLines([...lines, { 
            unique: Date.now(), 
            idproduct, 
            name: inputRef.current!.value, 
            qty: +qtyRef.current!.value 
        }]);

        inputRef.current!.value = '';
        qtyRef.current!.value = '';
    }

    const deleteLine = (line: Line) => {
        setResult(initialStatus);
        setLines(lines.filter((l) => (l.unique !== line.unique)));
    }  

    const saveHandler = () => {
        inputRef.current!.value = '';
        qtyRef.current!.value = '';

        type CleanLine = { idproduct: number, qty: number };

        const clean = lines.reduce(
            (accumulator: CleanLine[], currentLine) => {
                let found = accumulator.find((l) => (l.idproduct === currentLine.idproduct));
                if (found) {
                    found.qty += currentLine.qty;
                    return accumulator;
                } //else
                let cleanLine = { idproduct: currentLine.idproduct, qty: currentLine.qty };
                return [...accumulator, cleanLine];
            }, []
        );

        restock(clean).then(({ data }) => {
            setResult({ success: true, msg: data.body.msg });
        }).catch((error) => {
            setResult({ success: false, msg: (error?.response?.data?.body?.msg.join() || "Couldn't save.") });
        })
    }

    return (<Fragment>
        <section className={styles.grid}>
            <label>Product: </label>
            <input name='name' className={styles.input} ref={inputRef} onChange={inputChangeHandler} list="productNamesForRestock" />
            <datalist id="productNamesForRestock">
                {products.map((p) => (
                    <option key={p.idproduct} id={''+p.idproduct} value={p.name} />
                ))}
            </datalist>
            <span></span>
            <label>Qty: </label>
            <input name='qty' className={styles.input} ref={qtyRef} type="number" min={1} />
            <span className={styles.msg +' '+ (validity.success ? styles.valid : styles.invalid)}>{validity.msg}</span>
            <button className={styles.input} onClick={writeLineHandler}>Write</button>

        </section>
        <hr />
        <table className={styles.table}>
            <thead>
                <tr>
                    <td></td>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Qty</th>
                </tr>
            </thead>
            <tbody>
                {lines.map((l) => <tr>
                        <td><button onClick={() => {deleteLine(l)}} className={styles.unset}>🗑️</button></td>
                        <td>{l.idproduct}</td>
                        <td>{l.name}</td>
                        <td>{l.qty}</td>
                </tr>)}
            </tbody>
        </table>
        {!!lines[0] && 
            <button className={styles.input} onClick={saveHandler}>
                Save
            </button>
        }
        {!!result.msg && 
            <p className={styles.msg +' '+ (result.success ? styles.valid : styles.invalid)}>
                {result.msg}
            </p>
        }
    </Fragment>);
}

export default RestockPanel;