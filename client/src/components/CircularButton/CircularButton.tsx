import { useRef, useEffect } from 'react';
import styles from './CircularButton.module.css';

const CircularButton = ({ icon, color1, color2, children, onClick, title }:
    {
        icon?: JSX.Element,
        color1?: string,
        color2?: string,
        children?: React.ReactNode,
        onClick?: React.MouseEventHandler<HTMLButtonElement>,
        title?: string
    }    
) => {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (ref.current) {
            color1 ||= '#509eeb';
            color2 ||= 'white';
            let color3 = ((color2 === 'transparent') ? 'white' : color2);
            ref.current.style.setProperty('--color1', color1);
            ref.current.style.setProperty('--color2', color2);
            ref.current.style.setProperty('--color3', color3);
        }
    }, [ref, color1, color2]);

    return (
        <button onClick={onClick} ref={ref} className={styles["card-button"]} title={title}>
            {!!icon && icon}
            {!!children && children}
        </button>
    );
}

export default CircularButton;