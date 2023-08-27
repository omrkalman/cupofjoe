import styles from './Loading.module.css';

const Loading = () => {
    return (
        <div className={styles["lds-facebook"]}><div></div><div></div><div></div></div>
    )
}

export default Loading;