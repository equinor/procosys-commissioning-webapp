import axios from 'axios';
import { IAuthService } from './authService';

type ProcosysApiSettings = {
    baseUrl: string;
    apiVersion: string;
    scope: string[];
};

export const getApiSettings = async (endpoint: string, accessToken: string) => {
    const { data } = await axios.get(endpoint, {
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
    });
    return data.configuration.procosysWebApi as ProcosysApiSettings;
};

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
            console.dir(error);
            throw new Error(error.response.data);
        }
    );
    return axiosInstance;
};

export default baseApiService;
