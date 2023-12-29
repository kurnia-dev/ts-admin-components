import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const isObjectEmpty = (obj: object) => {
  if (!obj) return true;
  const keys = Object.keys(obj);
  return !keys.length;
};

const addTokenExpirationHandling = (instance: AxiosInstance) => {
  instance.interceptors.response.use((response: AxiosResponse) => {
    return response
  }, (error: AxiosError) => {
    if ( error.response?.status === 401) {
      localStorage.removeItem('user')
      window.location.reload()
    }
  })
}

const filterSelectedTreeKeys = (keys: any) => {
  const formatted = Object.entries(keys);
  const filtered = formatted
    .filter((data: any) => data[1].checked && !data[1].partialChecked)
    .map((data) => parseInt(data[0]));
  return filtered;
};

const getImgURL = (fileName: string) => {
  return `https://assets.tagsamurai.com/img/${fileName}`;
};

export {
  isObjectEmpty,
  addTokenExpirationHandling,
  filterSelectedTreeKeys,
  getImgURL,
};
