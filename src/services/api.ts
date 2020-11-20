import axios, { CancelToken } from 'axios';
import { Plant } from '../contexts/PlantContext';
import objectToCamelCase from '../utils/objectToCamelCase';
import * as auth from './authService';

const baseURL = 'https://procosyswebapiqp.equinor.com/api/';

export type Project = {
    description: string;
    id: number;
    title: string;
};

export type CommPackageFromSearch = {
    id: number;
    commPkgNo: string;
    description: string;
    mcStatus: string;
    commStatus: string;
    commissioningHandoverStatus: string;
    operationHandoverStatus: string;
};

export type CommPackageSearchResults = {
    maxAvailable: number;
    items: CommPackageFromSearch[];
};

axios.interceptors.request.use(async (request) => {
    try {
        const token = await auth.getAccessToken();
        request.headers['Authorization'] = `Bearer ${token}`;
        return request;
    } catch (error) {
        console.log(error);
        return request;
    }
});

export const getPlants = async () => {
    try {
        const { data } = await axios.get(
            baseURL + 'Plants?includePlantsWithoutAccess=false&api-version=4.1'
        );
        const camelCasedResponse = objectToCamelCase(data);
        const camelCasedResponseWithSlug = camelCasedResponse.map(
            (plant: Plant) => ({
                ...plant,
                slug: plant.id.substr(4),
            })
        );
        return camelCasedResponseWithSlug as Plant[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getProjectsForPlant = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL + `Projects?plantId=${plantId}&api-version=4.1`
        );
        return objectToCamelCase(data) as Project[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getPermissionsForPlant = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL + `Permissions?plantId=${plantId}&api-version=4.1`
        );
        return data as string[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const searchForCommPackage = async (
    query: string,
    projectId: number,
    plantId: string,
    cancelToken?: CancelToken
) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${query}&includeClosedProjects=false&projectId=${projectId}&api-version=4.1`,
            { cancelToken }
        );
        return objectToCamelCase(data) as CommPackageSearchResults;
    } catch (err) {
        return Promise.reject(err);
    }
};
