const baseURL = '/images/';

const getImageUrl = (filename: string) => {
    if (filename) return baseURL + filename;
}

export {
    getImageUrl
};