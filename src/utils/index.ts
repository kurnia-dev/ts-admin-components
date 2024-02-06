import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import exportToExcel from './exportToExcel.util';
import { formatDate } from './date.util';
import { formatUserName, formatVowelSoundLabel } from './textFormater.util';
import { ToastServiceMethods } from 'primevue/toastservice';

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

interface ToastParams {
  toast: ToastServiceMethods;
  activity: string;
}

type ErrorToastParams = ToastParams & { error: any };

const handleError = (params: ErrorToastParams): void => {
  const isNetworkError = params.error.code === 'ERR_NETWORK';
  const additionalMsg = isNetworkError
    ? ' Please check your connection again.'
    : '';

  let message = `Error, failed to ${params.activity}. ${additionalMsg}`;
  if (params.error.response?.status === 400) {
    message = params.error.response.data?.message;
  }

  params.toast.add({
    severity: 'error',
    detail: message,
    life: 3000,
  });
};

const handleSuccess = (params: ToastParams): void => {
  const message = `Success, ${params.activity}.`;
  params.toast.add({
    severity: 'success',
    detail: message,
    life: 3000,
  });
};

export {
  isObjectEmpty,
  addTokenExpirationHandling,
  filterSelectedTreeKeys,
  getImgURL,
  exportToExcel,
  formatDate,
  formatUserName,
  formatVowelSoundLabel,
  handleError,
  handleSuccess,
};
