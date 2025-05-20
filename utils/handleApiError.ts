import { AxiosError } from "axios";
export const handleApiError = (
  error: unknown,
  defaultMessage = "Something went wrong"
): string => {
  console.log("Raw Error:", error);
  if (error instanceof AxiosError) {
    console.error("API error:", error);
    if (error.response) {
      const { data } = error.response;
      if (data) {
        if (data.errors) {
          if (typeof data.errors === "object" && !Array.isArray(data.errors)) {
            for (const field in data.errors) {
              if (data.errors[field]) {
                return (
                  Array.isArray(data.errors[field])
                    ? data.errors[field][0]
                    : data.errors[field]
                ) || defaultMessage;
              }
            }
          }
          if (Array.isArray(data.errors) && data.errors.length > 0) {
            return data.errors[0] || defaultMessage;
          }
        }
        return (
          data.message ||
          data.error ||
          data.msg ||
          data.detail ||
          error.response.statusText ||
          defaultMessage
        );
      }
      return error.response.statusText || defaultMessage;
    }

    // Network error (no response)
  if (error.request) {
  const errorDetails = {
    url: error.request._url,
    method: error.request._method,
    headers: error.request._headers,
    readyState: error.request.readyState,
    status: error.request.status,
    responseURL: error.request.responseURL,
    timeout: error.request.timeout,
  };
  console.error("Network error details:", {
    requestDetails: errorDetails,
    message: error.message,
    config: error.config,
  });
  return `Network error: ${JSON.stringify(errorDetails)}`; 
}

    // Other Axios errors
    return error.message || defaultMessage;
  }

  // Handle non-Axios errors
  console.error("Non-Axios error:", error);
  return error instanceof Error ? error.message : defaultMessage;
};