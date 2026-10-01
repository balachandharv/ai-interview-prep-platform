export const getErrorMessage = (error, defaultMessage = 'An unexpected error occurred') => {
  if (!error) return defaultMessage;
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return 'Network Error: Please check your connection and try again.';
  }
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request Timeout: The server took too long to respond.';
  }
  return error.message || defaultMessage;
};
