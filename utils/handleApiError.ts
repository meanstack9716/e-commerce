import { AxiosError } from "axios";
export const handleApiError = (
  error: unknown,
  defaultMessage = "Something went wrong"
): string => {
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
                  (Array.isArray(data.errors[field])
                    ? data.errors[field][0]
                    : data.errors[field]) || defaultMessage
                );
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

    if (error.request) {
      return "Network error: Unable to reach the server";
    }
    return error.message || defaultMessage;
  }

  console.error("Non-Axios error:", error);
  return error instanceof Error ? error.message : defaultMessage;
};
