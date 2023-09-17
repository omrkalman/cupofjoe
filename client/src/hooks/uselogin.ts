import { login } from '../api/auth';
import useUserInfo from "./useUserInfo";
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user';

const useLogin = () => {

    const userInfo = useUserInfo();
    const dispatch = useDispatch();

    return async(credentials: {email: string, pw: string}) => {
        try {
            const { data } = await login(credentials);
            dispatch(userActions.logIn());
            localStorage.setItem('token', data.body.token);
            userInfo();
        } catch(error: any) {
            throw error?.response?.data?.body?.msg || ["Couldn't log in."];
        }
    }
}

export default useLogin;