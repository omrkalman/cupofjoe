import API from './API';
import { EditableUserField } from '../types/types';

const baseRoute = '/auth';

const api = new API(baseRoute);

const getUserInfoFromToken = () => api.get('');

const login = (credentails: {email: string, pw: string}) => api.post('/login', credentails);

const signup = (details: { email: string, pw: string, phone: string, fn: string, ln: string, city: string, address: string }) => api.post('/register', details);

const edit = (field: { [k in EditableUserField]?: string }) => api.patch('/edit', field);

const unlock = (options: { iduser?: number, email?: string, phone?: string }) => {
    const { iduser, email, phone } = options;
    if (iduser) return api.patch('/unlock', { iduser }); //else
    if (email) return api.patch('/unlock', { email }); // else
    return api.patch('/unlock', { phone });
}

export {
    getUserInfoFromToken,
    login,
    signup,
    edit,
    unlock
}