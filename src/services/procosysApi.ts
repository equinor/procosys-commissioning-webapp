import { AxiosInstance, CancelToken } from 'axios';
import {
    PunchAction,
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/Punch/ClearPunch/useClearPunchFacade';
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
    PunchItem,
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
        commPkgId: string
    ) => Promise<CommPkg>;
    postClear: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    postSetOk: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    postSetNA: (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => Promise<void>;
    postNewPunch: (plantId: string, newPunchData: NewPunch) => Promise<void>;
    getPunchOrganizations: (plantId: string) => Promise<PunchOrganization[]>;
    getPunchList: (
        plantId: string,
        commPkgId: string
    ) => Promise<PunchPreview[]>;
    getPunchTypes: (plantId: string) => Promise<PunchType[]>;
    getPunchCategories: (plantId: string) => Promise<PunchCategory[]>;
    postSign: (plantId: string, checklistId: string) => Promise<void>;
    postUnsign: (plantId: string, checklistId: string) => Promise<void>;
    putChecklistComment: (
        plantId: string,
        checklistId: string,
        Comment: string
    ) => Promise<void>;
    putMetaTableCell: (
        plantId: string,
        checkItemId: number,
        checklistId: string,
        columnId: number,
        rowId: number,
        value: string
    ) => Promise<void>;
    getTasks: (plantId: string, commPkgId: string) => Promise<TaskPreview[]>;
    getScope: (
        plantId: string,
        commPkgId: string
    ) => Promise<ChecklistPreview[]>;
    searchForCommPackage: (
        query: string,
        projectId: number,
        plantId: string,
        cancelToken?: CancelToken
    ) => Promise<CommPkgSearchResults>;
    getPunchItem: (plantId: string, punchItemId: string) => Promise<PunchItem>;
    putUpdatePunch: (
        plantId: string,
        punchItemId: string,
        updateData: UpdatePunchData,
        endpoint: UpdatePunchEndpoint
    ) => Promise<void>;
    postPunchAction: (
        plantId: string,
        punchItemId: string,
        punchAction: PunchAction
    ) => Promise<void>;
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
    };

    const getProjectsForPlant = async (plantId: string) => {
        const { data } = await axios.get(
            `Projects?plantId=${plantId}${apiVersion}`
        );
        return objectToCamelCase(data) as Project[];
    };

    const getPermissionsForPlant = async (plantId: string) => {
        const { data } = await axios.get(
            `Permissions?plantId=${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const searchForCommPackage = async (
        query: string,
        projectId: number,
        plantId: string,
        cancelToken?: CancelToken
    ) => {
        const {
            data,
        } = await axios.get(
            `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${query}&includeClosedProjects=false&projectId=${projectId}${apiVersion}`,
            { cancelToken }
        );

        return objectToCamelCase(data) as CommPkgSearchResults;
    };

    const getCommPackageDetails = async (
        plantId: string,
        commPkgId: string
    ) => {
        const response = await axios.get(
            `CommPkg?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}
`
        );
        return objectToCamelCase(response.data) as CommPkg;
    };

    const getScope = async (plantId: string, commPkgId: string) => {
        const { data } = await axios.get(
            `CommPkg/Checklists?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`
        );
        return objectToCamelCase(data) as ChecklistPreview[];
    };

    const getTasks = async (plantId: string, commPkgId: string) => {
        const { data } = await axios.get(
            `CommPkg/Tasks?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`
        );
        return objectToCamelCase(data) as TaskPreview[];
    };

    const getPunchList = async (plantId: string, commPkgId: string) => {
        const { data } = await axios.get(
            `CommPkg/PunchList?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchPreview[];
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
        checklistId: string,
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
        checklistId: string,
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
        checklistId: string,
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
        checklistId: string,
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
        checklistId: string,
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

    const postSign = async (plantId: string, checklistId: string) => {
        await axios.post(
            `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return Promise.resolve();
    };

    const postUnsign = async (plantId: string, checklistId: string) => {
        await axios.post(
            `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
        return Promise.resolve();
    };

    const getPunchCategories = async (plantId: string) => {
        const { data } = await axios.get(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchCategory[];
    };

    const getPunchTypes = async (plantId: string) => {
        const { data } = await axios.get(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchType[];
    };

    const getPunchOrganizations = async (plantId: string) => {
        const { data } = await axios.get(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchOrganization[];
    };

    const postNewPunch = async (plantId: string, newPunchData: NewPunch) => {
        await axios.post(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
        return Promise.resolve();
    };

    const getPunchItem = async (plantId: string, punchItemId: string) => {
        const { data } = await axios.get(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`
        );
        return objectToCamelCase(data) as PunchItem;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemId: string,
        updateData: UpdatePunchData,
        endpoint: UpdatePunchEndpoint
    ) => {
        const dto = { PunchItemId: punchItemId, ...updateData };
        await axios.put(
            `PunchListItem/${endpoint}?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    /* Used for clearing, unclearing, rejecting and verifying a */
    const postPunchAction = async (
        plantId: string,
        punchItemId: string,
        punchAction: PunchAction
    ) => {
        await axios.post(
            `PunchListItem/${punchAction}?plantId=PCS$${plantId}${apiVersion}`,
            punchItemId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    return {
        getPunchItem,
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
        postPunchAction,
    };
};

export default procosysApiService;
