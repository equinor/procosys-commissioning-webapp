import axios, { CancelToken } from 'axios';
import objectToCamelCase from '../utils/objectToCamelCase';
import {
    ChecklistPreview,
    ChecklistResponse,
    CommPkg,
    CommPkgSearchResults,
    Plant,
    Project,
    PunchPreview,
    TaskPreview,
} from './apiTypes';
import * as auth from './authService';

const baseURL = 'https://procosyswebapiqp.equinor.com/api/';

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

        return objectToCamelCase(data) as CommPkgSearchResults;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getCommPackageDetails = async (
    plantId: string,
    commPkgNumber: string,
    projectName: string
) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `CommPkg/ByCommPkgNos?plantId=${plantId}&commPkgNos=${commPkgNumber}&projectName=${projectName}&api-version=4.1
`
        );
        return objectToCamelCase(data[0]) as CommPkg;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getScope = async (plantId: string, commPkgId: number) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `CommPkg/Checklists?plantId=${plantId}&commPkgId=${commPkgId}&api-version=4.1`
        );
        return objectToCamelCase(data) as ChecklistPreview[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getTasks = async (plantId: string, commPkgId: number) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `CommPkg/Tasks?plantId=${plantId}&commPkgId=${commPkgId}&api-version=4.1`
        );
        return objectToCamelCase(data) as TaskPreview[];
    } catch (error) {
        return Promise.reject(error);
    }
};
export const getPunchList = async (plantId: string, commPkgId: number) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `CommPkg/PunchList?plantId=${plantId}&commPkgId=${commPkgId}&api-version=4.1`
        );
        return objectToCamelCase(data) as PunchPreview[];
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getChecklist = async (plantId: string, checklistId: string) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `Checklist/Comm?plantId=PCS$${plantId}&checklistId=${checklistId}&api-version=4.1`
        );
        return objectToCamelCase(data) as ChecklistResponse;
    } catch (error) {
        return Promise.reject(error);
    }
};
