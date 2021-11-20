import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const user = cookies.get('user');
export const jwt = cookies.get('jwt') ? cookies.get('jwt') : false;