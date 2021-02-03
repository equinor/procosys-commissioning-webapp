import axios from 'axios';
import { IAuthService } from './authService';

type ProcosysApiSettings = {
    baseUrl: string;
    version: string;
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

const baseApiService = (
    authInstance: IAuthService,
    baseURL: string,
    scope: string[]
) => {
    const axiosInstance = axios.create();
    axiosInstance.defaults.baseURL = baseURL;
    axiosInstance.interceptors.request.use(async (request) => {
        try {
            const token = await authInstance.getAccessToken(scope);
            request.headers['Authorization'] = `Bearer ${token}`;
            return request;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    });
    return axiosInstance;
};

export default baseApiService;
