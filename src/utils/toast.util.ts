import { useToast } from 'primevue/usetoast';
import { AxiosError } from 'axios';

type ToastParams = {
  activity: string;
};

interface ErrorResponse {
  message: string;
}

type ErrorToastParams = ToastParams & { error: AxiosError<ErrorResponse> };

const handleError = (params: ErrorToastParams): void => {
  const toast = useToast();
  const isNetworkError =
    params.error.isAxiosError && params.error.code === 'ERR_NETWORK';

  const additionalMsg = isNetworkError
    ? 'Please check your connection and try again'
    : '';

  let message = `Error, failed to ${params.activity}. ${additionalMsg}.`;
  if (params.error.response?.status === 400) {
    message = params.error.response.data.message;
  }

  toast.add({
    severity: 'error',
    detail: message,
    life: 3000,
  });
};

const handleSuccess = (params: ToastParams) => {
  const toast = useToast();

  const message = `Success, ${params.activity}`;
  toast.add({
    severity: 'success',
    detail: message,
    life: 3000,
  });
};

export { handleError, handleSuccess };
