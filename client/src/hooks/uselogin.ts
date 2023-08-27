import { login } from '../api/auth';
import useUserInfo from "./useUserInfo";

const useLogin = () => {

    const userInfo = useUserInfo();

    return async(credentials: {email: string, pw: string}) => {
        try {
            const { data } = await login(credentials);
            localStorage.setItem('token', data.body.token);
            userInfo();
        } catch(error: any) {
            throw error?.response?.data?.body?.msg || ["Couldn't log in."];
        }
    }
}

export default useLogin;