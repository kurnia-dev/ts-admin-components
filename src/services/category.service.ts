import axios, { AxiosResponse } from 'axios';
import { addTokenExpirationHandling } from '@/utils';

const user = JSON.parse(localStorage.getItem('user')!);
const API = ({ headers = {}, params = {} } = {}) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_CATEGORY_API}/v2/categories`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
      ...headers,
    },
    params,
  });

  // addTokenExpirationHandling(instance);

  return instance;
};

const CategoriesServices = {
  getCategories: (): Promise<AxiosResponse> => {
    return API().get('/tree');
  },
};

export default CategoriesServices;
