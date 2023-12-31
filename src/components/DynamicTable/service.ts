import axios from 'axios';

const API = ({ headers = {}, params = {} } = {}) => {
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_ASSETS_API}`,
    headers: {
      Authorization: `Bearer`,
      ...headers,
    },
    params,
  });
  return instance;
};

export const getTagStock = async (params: any = {}) => {
  try {
    return await API({ params }).get('/v2/_id');
  } catch (error) {
    console.log(error);
  }
};