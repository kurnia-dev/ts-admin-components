import { useToast } from 'primevue/usetoast';
import { AxiosError } from 'axios';

type ToastParams = {
  activity: string;
};

interface ErrorResponse {
  message: string;
}

type ErrorToastParams = ToastParams & { error: AxiosError<ErrorResponse> };

const handleError = ({ activity, error }: ErrorToastParams): void => {
  const toast = useToast();
  const isNetworkError = error.isAxiosError && error.code === 'ERR_NETWORK';

  const additionalMsg = isNetworkError
    ? 'Please check your connection and try again'
    : '';

  let message = `Error, failed to ${activity}. ${additionalMsg}.`;
  if (error.response?.status === 400) {
    message = error.response.data.message;
  }

  toast.add({
    severity: 'error',
    detail: message,
    life: 3000,
  });
};

const handleSuccess = ({ activity }: ToastParams) => {
  const toast = useToast();

  const message = `Success, ${activity}`;
  toast.add({
    severity: 'success',
    detail: message,
    life: 3000,
  });
};

export { handleError, handleSuccess };