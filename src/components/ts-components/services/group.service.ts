import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface ServiceOptions {
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

const API = ({
  headers = {},
  params = {},
}: ServiceOptions = {}): AxiosInstance => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const BASE_URL = import.meta.env.VITE_APP_GROUP_API;

  const instance = axios.create({
    baseURL: `${BASE_URL}/v2/groups`,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${user.token}`,
      ...headers,
    },
    params,
  });

  return instance;
};

const GroupServices = {
  getGroupTreeList: (): Promise<AxiosResponse> => {
    return API().get('/tree');
  },
};

export default GroupServices;
