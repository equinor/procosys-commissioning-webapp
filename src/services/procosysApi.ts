import { AxiosInstance, CancelToken } from 'axios';
import buildEndpoint from '../utils/buildEndpoint';
import {
    PunchAction,
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/Punch/ClearPunch/useClearPunchFacade';
import { TaskCommentDto } from '../pages/Task/TaskDescription';
import { TaskParameterDto } from '../pages/Task/TaskParameters/TaskParameters';
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
    Task,
    TaskParameter,
    Attachment,
} from './apiTypes';

type PostAttachmentProps = {
    plantId: string;
    parentId?: string;
    data: FormData;
    title?: string;
};

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
};

const procosysApiService = ({ axios, apiVersion }: ProcosysApiServiceProps) => {
    const getVersion = () => {
        return apiVersion;
    };
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
        await axios.post(
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    };

    const postSetNA = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => {
        await axios.post(
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    };

    const postClear = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ) => {
        await axios.post(
            `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
        return Promise.resolve();
    };

    const putMetaTableCell = async (
        plantId: string,
        checkItemId: number,
        checklistId: string,
        columnId: number,
        rowId: number,
        value: string
    ) => {
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
    };

    const putChecklistComment = async (
        plantId: string,
        checklistId: string,
        Comment: string
    ) => {
        await axios.put(
            `CheckList/Comm/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
        return Promise.resolve();
    };

    const postSign = async (plantId: string, checklistId: string) => {
        await axios.post(
            `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const postUnsign = async (plantId: string, checklistId: string) => {
        await axios.post(
            `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
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

    const getTask = async (plantId: string, taskId: string) => {
        const { data } = await axios.get(
            `CommPkg/Task?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`
        );
        return objectToCamelCase(data) as Task;
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

    const postTaskSign = async (plantId: string, taskId: string) => {
        await axios.post(
            `CommPkg/Task/Sign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const postTaskUnsign = async (plantId: string, taskId: string) => {
        await axios.post(
            `CommPkg/Task/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const putTaskComment = async (plantId: string, dto: TaskCommentDto) => {
        await axios.put(
            `CommPkg/Task/Comment?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskParameters = async (plantId: string, taskId: string) => {
        const { data } = await axios.get(
            `CommPkg/Task/Parameters?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`
        );
        return objectToCamelCase(data) as TaskParameter[];
    };

    const putTaskParameter = async (plantId: string, dto: TaskParameterDto) => {
        await axios.put(
            `CommPkg/Task/Parameters/Parameter?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskAttachments = async (plantId: string, taskId: string) => {
        const { data } = await axios.get(
            `CommPkg/Task/Attachments?plantId=PCS$${plantId}&taskId=${taskId}&thumbnailSize=32${apiVersion}`
        );
        return objectToCamelCase(data) as Attachment[];
    };

    const getTaskAttachment = async (
        plantId: string,
        taskId: string,
        attachmentId: number
    ) => {
        const { data } = await axios.get(
            `CommPkg/Task/Attachment?plantId=PCS$${plantId}&taskId=${taskId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
        );
        return data as Blob;
    };

    const getChecklistAttachments = async (
        plantId: string,
        checklistId: string
    ) => {
        const { data } = await axios.get(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32${apiVersion}`
        );
        return objectToCamelCase(data) as Attachment[];
    };

    const getChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ) => {
        const { data } = await axios.get(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
        );
        return data as Blob;
    };

    const deleteChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ) => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            { data: dto }
        );
    };

    const postChecklistAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps) => {
        await axios.post(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${parentId}&title=${title}${apiVersion}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    const getAttachments = async (endpoint: string) => {
        const { data } = await axios.get(`${endpoint}${apiVersion}`);
        return objectToCamelCase(data) as Attachment[];
    };

    const getPunchAttachment = async (
        plantId: string,
        punchItemId: string,
        attachmentId: number
    ) => {
        const { data } = await axios.get(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
        );
        return data as Blob;
    };

    const deletePunchAttachment = async (
        plantId: string,
        punchItemId: string,
        attachmentId: number
    ) => {
        const dto = {
            PunchItemId: parseInt(punchItemId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            { data: dto }
        );
    };

    const postTempPunchAttachment = async ({
        plantId,
        parentId,
        data: formData,
        title,
    }: PostAttachmentProps) => {
        const { data } = await axios.post(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data.Id as string;
    };

    const postPunchAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps) => {
        await axios.post(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${parentId}&title=${title}${apiVersion}`,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    return {
        deleteChecklistAttachment,
        deletePunchAttachment,
        getVersion,
        getAttachments,
        getPunchAttachment,
        getChecklistAttachments,
        getChecklistAttachment,
        getTaskAttachments,
        getTaskAttachment,
        getPunchItem,
        getPlants,
        getProjectsForPlant,
        getPermissionsForPlant,
        getChecklist,
        getCommPackageDetails,
        getPunchOrganizations,
        getPunchList,
        getPunchTypes,
        getPunchCategories,
        getTask,
        getTasks,
        getScope,
        getTaskParameters,
        postClear,
        postSetOk,
        postSetNA,
        postNewPunch,
        postPunchAction,
        postTaskSign,
        postTaskUnsign,
        postPunchAttachment,
        postSign,
        postUnsign,
        postTempPunchAttachment,
        postChecklistAttachment,
        putChecklistComment,
        putMetaTableCell,
        putTaskComment,
        putTaskParameter,
        putUpdatePunch,
        searchForCommPackage,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
