import axios from 'axios';
import { addTokenExpirationHandling } from '@/utils';

const user = JSON.parse(localStorage.getItem('user')!);
const api = ({ headers = {}, params = {} } = {}) => {
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_SETTINGS_API}/v2/groups`,
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

const getGroupTreeList = (params?: object) => {
  return api({ params }).get('/tree');
};

const GroupAPIs = {
  getGroupTreeList,
};

export default GroupAPIs;
