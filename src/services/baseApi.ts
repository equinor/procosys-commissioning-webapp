import axios, { AxiosInstance } from "axios";
import objectToCamelCase from "../utils/objectToCamelCase";
import { IAuthService } from "./authService";

type baseApiProps = {
  authInstance: IAuthService;
  baseURL: string;
  scope: string[];
};

const baseApiService = ({
  authInstance,
  baseURL,
  scope
}: baseApiProps): AxiosInstance => {
  const axiosInstance = axios.create();
  axiosInstance.defaults.baseURL = baseURL;
  axiosInstance.interceptors.request.use(async (request) => {
    try {
      const token = await authInstance.getAccessToken(scope);
      if (request.headers) {
        request.headers["Authorization"] = `Bearer ${token}`;
      }
      return request!;
    } catch (error) {
      const pcsError = error as Error;
      throw new Error(pcsError.message);
    }
  });
  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data instanceof Blob) return response;
      response.data = objectToCamelCase(response.data);
      return response;
    },
    (error) => {
      if (axios.isCancel(error)) {
        throw error;
      }
      if (error.response) {
        const errorData = error.response.data;
        throw new Error(
          typeof errorData === "string" ? errorData : errorData.Message
        );
      } else {
        throw new Error(error.message);
      }
    }
  );
  return axiosInstance;
};

export default baseApiService;
