import { useDispatch } from "react-redux"
import { userActions } from "../store/user";
import { favsActions } from "../store/favs";
import { getUserInfoFromToken } from '../api/auth';
import { getFavs } from "../api/fav";

const useUserInfo = () => {
    const dispatch = useDispatch();
    return async () => {
        if (localStorage.getItem('token')) {            
            try {
                var { data } = await getUserInfoFromToken();                
                dispatch(userActions.set(data.body.user));
                var { data } = await getFavs();
                dispatch(favsActions.set(data.body.favs));
            } catch(error) {
                console.error(error);
            }
        }
    }
}

export default useUserInfo;