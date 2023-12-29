import axios from 'axios';
import { addTokenExpirationHandling } from '@/utils';

const user = JSON.parse(localStorage.getItem('user')!);
const api = ({ headers = {}, params = {} } = {}) => {
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_SETTINGS_API}/v2/categories`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
      ...headers,
    },
    params,
  });

  addTokenExpirationHandling(instance);

  return instance;
};

const getCategoryTreeList = () => {
  return api().get('/tree');
};

const CategoryAPIs = {
  getCategoryTreeList,
};

export default CategoryAPIs;
