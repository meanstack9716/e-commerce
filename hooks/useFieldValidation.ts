import { useState } from "react";

interface Errors {
  [key: string]: string;
}

export const useFieldValidation = () => {
  const [errors, setErrors] = useState<Errors>({});
  const handleFieldChange = (
    fieldName: string,
    value: string,
    validator: (value: string) => boolean,
    errorMessage: string
  ) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${fieldName} is required`,
      }));
    } else if (!validator(value)) {
      setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailValidation = (
    email: string,
    errorMessage: string = "Enter a valid email"
  ) => {
    if (!email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: errorMessage,
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateStrongPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordValidation = (
    password: string,
    errorMessage: string = "Password must be 8 characters with uppercase, number & symbol"
  ) => {
    if (!password.trim()) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    } else if (!validateStrongPassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: errorMessage,
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validatePasswordMatch = (
    password: string,
    confirmPassword: string
  ): boolean => {
    return password === confirmPassword;
  };

  const handleConfirmPasswordMatch = (
    password: string,
    confirmPassword: string,
    errorMessage: string = "Passwords don't match"
  ) => {
    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm password is required",
      }));
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: errorMessage,
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleLoginPasswordValidation = (password: string) => {
    if (!password.trim()) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const resetErrors = () => {
    setErrors({});
  };

  const setFieldErrors = (newErrors: { [key: string]: string }) => {
    setErrors(newErrors);
  };

  const validateAllFields = (fields: {
    [key: string]: {
      value: string;
      validator: (value: string) => boolean;
      errorMessage: string;
    };
  }): boolean => {
    let hasError = false;
    const newErrors: Errors = {};

    Object.entries(fields).forEach(
      ([fieldName, { value, validator, errorMessage }]) => {
        if (!value.trim()) {
          newErrors[fieldName] = `${fieldName} is required`;
          hasError = true;
        } else if (!validator(value)) {
          newErrors[fieldName] = errorMessage;
          hasError = true;
        } else {
          newErrors[fieldName] = "";
        }
      }
    );

    setErrors(newErrors);
    return !hasError;
  };

  return {
    errors,
    handleFieldChange,
    handleEmailValidation,
    handlePasswordValidation,
    handleConfirmPasswordMatch,
    handleLoginPasswordValidation,
    resetErrors,
    validateEmail,
    setFieldErrors,
    validateAllFields,
  };
};
