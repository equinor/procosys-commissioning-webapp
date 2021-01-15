import axios, { AxiosError, CancelToken } from 'axios';
import objectToCamelCase from '../utils/objectToCamelCase';
import {
    ChecklistPreview,
    ChecklistResponse,
    CommPkg,
    CommPkgSearchResults,
    NewPunch,
    Plant,
    Project,
    PunchCategory,
    PunchOrganization,
    PunchPreview,
    PunchType,
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

export const postSetOk = async (
    plantId: string,
    checklistId: number,
    checkItemId: number
) => {
    try {
        await axios.post(
            baseURL +
                `CheckList/Item/SetOk?plantId=PCS$${plantId}&api-version=4.1`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
};

export const postSetNA = async (
    plantId: string,
    checklistId: number,
    checkItemId: number
) => {
    try {
        await axios.post(
            baseURL +
                `CheckList/Item/SetNA?plantId=PCS$${plantId}&api-version=4.1`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
};

export const postClear = async (
    plantId: string,
    checklistId: number,
    checkItemId: number
) => {
    try {
        await axios.post(
            baseURL +
                `CheckList/Item/Clear?plantId=PCS$${plantId}&api-version=4.1`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error);
    }
};

export const putMetaTableCell = async (
    plantId: string,
    checkItemId: number,
    checklistId: number,
    columnId: number,
    rowId: number,
    value: string
) => {
    try {
        await axios.put(
            baseURL +
                `CheckList/Item/MetaTableCell?plantId=PCS$${plantId}&api-version=4.1`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            }
        );
        return Promise.resolve();
    } catch (error) {
        console.log(error.message);
        return Promise.reject(error.message);
    }
};

export const putChecklistComment = async (
    plantId: string,
    checklistId: number,
    Comment: string
) => {
    try {
        await axios.put(
            baseURL +
                `CheckList/Comm/Comment?plantId=PCS$${plantId}&api-version=4.1`,
            { CheckListId: checklistId, Comment: Comment }
        );
        return Promise.resolve();
    } catch (error) {
        return Promise.reject(error.response);
    }
};

export const postSign = async (plantId: string, checklistId: number) => {
    try {
        await axios.post(
            baseURL +
                `CheckList/Comm/Sign?plantId=PCS$${plantId}&api-version=4.1`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return Promise.resolve();
    } catch (error) {
        console.log(error.message);
        return Promise.reject(error.message);
    }
};

export const postUnsign = async (plantId: string, checklistId: number) => {
    try {
        await axios.post(
            baseURL +
                `CheckList/Comm/Unsign?plantId=PCS$${plantId}&api-version=4.1`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return Promise.resolve();
    } catch (error) {
        console.log(error.message);
        return Promise.reject(error.message);
    }
};

export const getPunchCategories = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `PunchListItem/Categories?plantId=PCS$${plantId}&api-version=4.1`
        );
        return objectToCamelCase(data) as PunchCategory[];
    } catch (error) {
        console.log(error);
        return Promise.reject(error.message);
    }
};

export const getPunchTypes = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `PunchListItem/Types?plantId=PCS$${plantId}&api-version=4.1`
        );
        return objectToCamelCase(data) as PunchType[];
    } catch (error) {
        console.log(error);
        return Promise.reject(error.message);
    }
};

export const getPunchOrganizations = async (plantId: string) => {
    try {
        const { data } = await axios.get(
            baseURL +
                `PunchListItem/Organizations?plantId=PCS$${plantId}&api-version=4.1`
        );
        return objectToCamelCase(data) as PunchOrganization[];
    } catch (error) {
        console.log(error);
        return Promise.reject(error.message);
    }
};

export const postNewPunch = async (plantId: string, newPunchData: NewPunch) => {
    try {
        await axios.post(
            baseURL + `PunchListItem?plantId=PCS$${plantId}&api-version=4.1`,
            newPunchData
        );
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        return Promise.reject(error.message);
    }
};
