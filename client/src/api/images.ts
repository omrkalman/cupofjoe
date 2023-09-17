const baseURL = import.meta.env.VITE_HOST + '/images/';

const getImageUrl = (filename: string) => {
    if (filename) return baseURL + filename;
}

export {
    getImageUrl
};