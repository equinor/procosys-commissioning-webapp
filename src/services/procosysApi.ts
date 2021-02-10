import { AxiosInstance, CancelToken } from 'axios';
import {
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/ClearPunch/useClearPunchFacade';
import objectToCamelCase from '../utils/objectToCamelCase';
import {
    Plant,
    Project,
    CommPkgSearchResults,
    CommPkg,
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
    ChecklistResponse,
    PunchCategory,
    PunchType,
    PunchOrganization,
    NewPunch,
    PunchListItem,
} from './apiTypes';

export type ProcosysApiService = {
    getPlants: () => Promise<Plant[]>;
    getProjectsForPlant: (plantId: string) => Promise<Project[]>;
    getPermissionsForPlant: (plantId: string) => Promise<string[]>;
    getChecklist: (
        plantId: string,
        checklistId: string
    ) => Promise<ChecklistResponse>;
    getCommPackageDetails: (
        plantId: string,
        commPkgNumber: string,
        projectName: string
    ) => Promise<CommPkg>;
    postClear: (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => Promise<void>;
    postSetOk: (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => Promise<void>;
    postSetNA: (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => Promise<void>;
    postNewPunch: (plantId: string, newPunchData: NewPunch) => Promise<void>;
    getPunchOrganizations: (plantId: string) => Promise<PunchOrganization[]>;
    getPunchList: (
        plantId: string,
        commPkgId: number
    ) => Promise<PunchPreview[]>;
    getPunchTypes: (plantId: string) => Promise<PunchType[]>;
    getPunchCategories: (plantId: string) => Promise<PunchCategory[]>;
    postSign: (plantId: string, checklistId: number) => Promise<void>;
    postUnsign: (plantId: string, checklistId: number) => Promise<void>;
    putChecklistComment: (
        plantId: string,
        checklistId: number,
        Comment: string
    ) => Promise<void>;
    putMetaTableCell: (
        plantId: string,
        checkItemId: number,
        checklistId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    getTasks: (plantId: string, commPkgId: number) => Promise<TaskPreview[]>;
    getScope: (
        plantId: string,
        commPkgId: number
    ) => Promise<ChecklistPreview[]>;
    searchForCommPackage: (
        query: string,
        projectId: number,
        plantId: string,
        cancelToken?: CancelToken
    ) => Promise<CommPkgSearchResults>;
    getPunchListItem: (
        plantId: string,
        punchItemId: number
    ) => Promise<PunchListItem>;
    putUpdatePunch: (
        plantId: string,
        punchItemId: number,
        updateData: UpdatePunchData,
        endpoint: UpdatePunchEndpoint
    ) => Promise<void>;
    postClearPunch: (plantId: string, punchItemId: number) => Promise<void>;
};

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
};

const procosysApiService = ({
    axios,
    apiVersion,
}: ProcosysApiServiceProps): ProcosysApiService => {
    const getPlants = async () => {
        try {
            const { data } = await axios.get(
                `Plants?includePlantsWithoutAccess=false${apiVersion}`
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

    const getProjectsForPlant = async (plantId: string) => {
        try {
            const { data } = await axios.get(
                `Projects?plantId=${plantId}${apiVersion}`
            );
            return objectToCamelCase(data) as Project[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const getPermissionsForPlant = async (plantId: string) => {
        try {
            const { data } = await axios.get(
                `Permissions?plantId=${plantId}${apiVersion}`
            );
            return data as string[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const searchForCommPackage = async (
        query: string,
        projectId: number,
        plantId: string,
        cancelToken?: CancelToken
    ) => {
        try {
            const {
                data,
            } = await axios.get(
                `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${query}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`,
                { cancelToken }
            );

            return objectToCamelCase(data) as CommPkgSearchResults;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const getCommPackageDetails = async (
        plantId: string,
        commPkgNumber: string,
        projectName: string
    ) => {
        try {
            const { data } = await axios.get(
                `CommPkg/ByCommPkgNos?plantId=${plantId}&commPkgNos=${commPkgNumber}&projectName=${projectName}${apiVersion}
`
            );
            return objectToCamelCase(data[0]) as CommPkg;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const getScope = async (plantId: string, commPkgId: number) => {
        try {
            const { data } = await axios.get(
                `CommPkg/Checklists?plantId=${plantId}&commPkgId=${commPkgId}${apiVersion}`
            );
            return objectToCamelCase(data) as ChecklistPreview[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const getTasks = async (plantId: string, commPkgId: number) => {
        try {
            const { data } = await axios.get(
                `CommPkg/Tasks?plantId=${plantId}&commPkgId=${commPkgId}${apiVersion}`
            );
            return objectToCamelCase(data) as TaskPreview[];
        } catch (error) {
            return Promise.reject(error);
        }
    };
    const getPunchList = async (plantId: string, commPkgId: number) => {
        try {
            const { data } = await axios.get(
                `CommPkg/PunchList?plantId=${plantId}&commPkgId=${commPkgId}${apiVersion}`
            );
            return objectToCamelCase(data) as PunchPreview[];
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const getChecklist = async (plantId: string, checklistId: string) => {
        try {
            const { data } = await axios.get(
                `Checklist/Comm?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`
            );
            return objectToCamelCase(data) as ChecklistResponse;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const postSetOk = async (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => {
        try {
            await axios.post(
                `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
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

    const postSetNA = async (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => {
        try {
            await axios.post(
                `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
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

    const postClear = async (
        plantId: string,
        checklistId: number,
        checkItemId: number
    ) => {
        try {
            await axios.post(
                `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
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

    const putMetaTableCell = async (
        plantId: string,
        checkItemId: number,
        checklistId: number,
        columnId: number,
        rowId: number,
        value: string
    ) => {
        try {
            await axios.put(
                `CheckList/Item/MetaTableCell?plantId=PCS$${plantId}${apiVersion}`,
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
            return Promise.reject(error.message);
        }
    };

    const putChecklistComment = async (
        plantId: string,
        checklistId: number,
        Comment: string
    ) => {
        try {
            await axios.put(
                `CheckList/Comm/Comment?plantId=PCS$${plantId}${apiVersion}`,
                { CheckListId: checklistId, Comment: Comment }
            );
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error.response);
        }
    };

    const postSign = async (plantId: string, checklistId: number) => {
        try {
            await axios.post(
                `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
                checklistId,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return Promise.resolve();
        } catch (error) {
            console.log(error.message);
            return Promise.reject(error.message);
        }
    };

    const postUnsign = async (plantId: string, checklistId: number) => {
        try {
            await axios.post(
                `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
                checklistId,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return Promise.resolve();
        } catch (error) {
            console.log(error.message);
            return Promise.reject(error.message);
        }
    };

    const getPunchCategories = async (plantId: string) => {
        try {
            const { data } = await axios.get(
                `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`
            );
            return objectToCamelCase(data) as PunchCategory[];
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const getPunchTypes = async (plantId: string) => {
        try {
            const { data } = await axios.get(
                `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`
            );
            return objectToCamelCase(data) as PunchType[];
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const getPunchOrganizations = async (plantId: string) => {
        try {
            const { data } = await axios.get(
                `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`
            );
            return objectToCamelCase(data) as PunchOrganization[];
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const postNewPunch = async (plantId: string, newPunchData: NewPunch) => {
        try {
            await axios.post(
                `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
                newPunchData
            );
            return Promise.resolve();
        } catch (error) {
            console.log(error);
            return Promise.reject(error.message);
        }
    };

    const getPunchListItem = async (plantId: string, punchItemId: number) => {
        const { data } = await axios.get(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchListItem;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemId: number,
        updateData: UpdatePunchData,
        endpoint: UpdatePunchEndpoint
    ) => {
        const dto = { PunchItemId: punchItemId, ...updateData };
        await axios.put(
            `PunchListItem/${endpoint}?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const postClearPunch = async (plantId: string, punchItemId: number) => {
        await axios.post(
            `PunchListItem/Clear?plantId=PCS$${plantId}${apiVersion}`,
            { PunchItemId: punchItemId }
        );
    };

    return {
        getPunchListItem,
        getPlants,
        getProjectsForPlant,
        getPermissionsForPlant,
        getChecklist,
        getCommPackageDetails,
        postClear,
        postSetOk,
        postSetNA,
        postNewPunch,
        getPunchOrganizations,
        getPunchList,
        getPunchTypes,
        getPunchCategories,
        postSign,
        postUnsign,
        putChecklistComment,
        putMetaTableCell,
        getTasks,
        getScope,
        searchForCommPackage,
        putUpdatePunch,
        postClearPunch,
    };
};

export default procosysApiService;
