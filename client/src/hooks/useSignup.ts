import { signup } from '../api/auth';

const useSignup = () => {

    return async(details: { 
        email: string, 
        pw: string, 
        phone: string, 
        fn: string, 
        ln: string, 
        city: string, 
        address: string 
    }) => {
        try {
            await signup(details);
        } catch(error: any) {
            throw { 
                msg: (error?.response?.data?.body?.msg || ["Couldn't sign up."]),
                fields: (error?.response?.data?.body?.fields || [])
            };
        }
    }
}

export default useSignup;