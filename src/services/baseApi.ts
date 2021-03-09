import axios from 'axios';
import { IAuthService } from './authService';

type baseApiProps = {
    authInstance: IAuthService;
    baseURL: string;
    scope: string[];
};

const baseApiService = ({ authInstance, baseURL, scope }: baseApiProps) => {
    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = baseURL;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            const token = await authInstance.getAccessToken(scope);
            request.headers['Authorization'] = `Bearer ${token}`;
            return request;
        } catch (error) {
            throw new Error(error.message);
        }
    });
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error.response) {
                throw new Error(error.response.data);
            } else {
                throw new Error(error.message);
            }
        }
    );
    return axiosInstance;
};

export default baseApiService;
