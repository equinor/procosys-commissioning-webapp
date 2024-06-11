import { AxiosError } from "axios";

export const renderErrors = (error: any) => {
  return Object.keys(error.response?.data?.errors)
    .map((key) => error.response?.data?.errors[key].toString())
    .toString();
};
export const hasErrors = (error: AxiosError) => {
  if (!error?.response?.data) return;
  return (
    typeof error?.response.data === "object" &&
    "errors" in error?.response?.data
  );
};
