import API from './API';

const baseRoute = '/fav';

const api = new API(baseRoute);

const addFav = (obj: {idproduct: number}) => api.put('/', obj);

const removeFav = (idproduct: number) => api.delete(`/${idproduct}`);

const getFavs = () => api.get('/');

export {
    addFav,
    getFavs,
    removeFav
}