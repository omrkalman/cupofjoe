import { useEffect, useState } from "react";

const useElementOnScreen = (
    ref: React.RefObject<Element>,
    rootMargin = "0px",
) => {
    const [isIntersecting, setIsIntersecting] = useState<boolean | undefined>();
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            { rootMargin }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);
    return isIntersecting;
}

export default useElementOnScreen;