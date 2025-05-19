import axios from 'axios';

function extractCustomErrorMessage(errorData) {
  const errorMessage = errorData?.errors?.error?.message;

  if (
    typeof errorMessage === 'object' &&
    errorMessage?.meta?.target === 'Users_username_key'
  ) {
    return 'Username is already existed';
  }

  if (typeof errorMessage === 'object' && errorMessage?.validationMessage) {
    return errorMessage.validationMessage;
  }

  return typeof errorMessage === 'string' ? errorMessage : undefined;
}

function getErrorMessage(error, defaultErrorMessage = 'An unexpected error occurred') {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;

    return (
      errorData?.message ||
      extractCustomErrorMessage(errorData || {}) ||
      defaultErrorMessage
    );
  }

  return error?.message || defaultErrorMessage;
}

export default getErrorMessage;
