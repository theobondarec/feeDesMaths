import Cookies from 'universal-cookie';
const TOKEN_KEY = 'jwt';

export const isLogin = () => {
    const cookies = new Cookies()
    if (cookies.get(TOKEN_KEY)) {
        return true;
    }
    return false;
}