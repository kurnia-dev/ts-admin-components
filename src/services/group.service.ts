import axios, { AxiosResponse } from 'axios';
import { addTokenExpirationHandling } from '@/utils';

const user = JSON.parse(localStorage.getItem('user')!);
const API = ({ headers = {}, params = {} } = {}) => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_APP_GROUP_API}/v2/groups`,
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

const GroupsServices = {
  getGroups: (): Promise<AxiosResponse> => {
    return API().get('/tree');
  },
};

export default GroupsServices;
