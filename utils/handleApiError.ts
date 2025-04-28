export const handleApiError = (error: any, defaultMessage = "Something went wrong") => {
    if (error.response?.data?.errors) {
      const errorData = error.response.data.errors;
      for (const field in errorData) {
        if (errorData[field]) {
          return errorData[field];
        }
      }
    }
    return error.response?.data?.message || error.message || defaultMessage;
  };
  