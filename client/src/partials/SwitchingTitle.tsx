import { useState, useRef, useEffect } from "react";
import styles from './SwitchingTitle.module.css';

const words = ['Coffee', 'Capsules', 'Machines', 'Taste', 'Quality'];


const SwitchingTitle = () => {

    let [word, setWord] = useState('Coffee');
    let [isDisappearing, setIsDisappearing] = useState(false);
    let h1Ref = useRef<HTMLHeadingElement>(null);
    
    useEffect(()=> {

        const scrollHandler = () => {
            const {top, height} = h1Ref.current!.getBoundingClientRect();
            h1Ref.current!.style.opacity = ''+(top/height);
        }
        window.addEventListener('scroll', scrollHandler);

        let i = 0;
        const interval1 = setInterval(()=> {
            setTimeout(()=> {
                i = (i + 1) % words.length;
                setWord(words[i]);
                setIsDisappearing(false);
                
            }, 1000);
        }, 4000);
        const interval = setInterval(()=> {
            setIsDisappearing(true);

        }, 4000);
        return () => {
            clearInterval(interval);
            clearInterval(interval1);
            window.removeEventListener('scroll', scrollHandler);
        }
    }, []);

    return (
        <h1 className={styles.h1} ref={h1Ref}>
            Explore 
            <span id={styles.span} className={isDisappearing ? styles.disappearing : ''}>
                {' '+word}
            </span>
        </h1>
    );
}

export default SwitchingTitle;