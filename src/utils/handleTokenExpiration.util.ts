/* eslint-disable promise/prefer-await-to-callbacks */
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const handleTokenExpiration = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.reload();
      }

      return Promise.reject(error);
    },
  );
};

export default handleTokenExpiration;
