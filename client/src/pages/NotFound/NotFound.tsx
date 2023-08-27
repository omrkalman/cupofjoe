import { Fragment } from "react"
import styles from './NotFound.module.css';

const NotFound = () => {
    return <Fragment>
        <h1 className={styles.h1}>We could not find what you were looking for...</h1>
        <img src="not-found.svg" alt="Not found" className={styles.illustration} />
    </Fragment>
}

export default NotFound;