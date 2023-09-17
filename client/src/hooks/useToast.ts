import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";


function useToast() {
    return (toastName: string) => {
        const MAX_SHOW = 3;
        const setF = (c: number) => sessionStorage.setItem(`${toastName}_count`, ''+c);
        let currentCount = parseInt(sessionStorage.getItem(`${toastName}_count`) || '0');
        let timeoutId = 0;

        if (currentCount < MAX_SHOW) {
            setF(++currentCount);
            timeoutId = setTimeout(() => {
                const toast = Toastify({
                    text: "Don't forget to switch between views ➜\n(Click to not show again)",
                    duration: 3000,
                    offset: {
                        x: 100,
                        y: 0
                    },
                    onClick: closeFn
                })
                function closeFn() {
                    toast.hideToast();
                    setF(MAX_SHOW);
                }
                toast.showToast();
            }, 3000);
        }
        else { }
        
        return timeoutId ? () => { clearTimeout(timeoutId) } : () => {}
    }
};

export default useToast;