import { isArrayOfType, isOfType } from '@equinor/procosys-webapp-components';
import { AxiosInstance, CancelToken } from 'axios';
import {
    PunchAction,
    UpdatePunchData,
    UpdatePunchEndpoint,
} from '../pages/Punch/ClearPunch/useClearPunchFacade';
import { SearchType } from '../pages/Search/Search';
import { TaskCommentDto } from '../pages/Task/TaskDescription';
import { TaskParameterDto } from '../pages/Task/TaskParameters/TaskParameters';
import { isCorrectDetails } from './apiTypeGuards';
import {
    Plant,
    Project,
    SearchResults,
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
    Tag,
    TagPreview,
} from './apiTypes';

type PostAttachmentProps = {
    plantId: string;
    parentId?: string;
    data: FormData;
    title?: string;
};

const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

type ProcosysApiServiceProps = {
    axios: AxiosInstance;
    apiVersion: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = ({ axios, apiVersion }: ProcosysApiServiceProps) => {
    // General
    const getVersion = (): string => {
        return apiVersion;
    };

    const getPlants = async (): Promise<Plant[]> => {
        const { data } = await axios.get(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`
        );
        const plantsWithoutSlug = data as Plant[];
        return plantsWithoutSlug.map((plant: Plant) => ({
            ...plant,
            slug: plant.id.substr(4),
        }));
    };

    const getProjectsForPlant = async (plantId: string): Promise<Project[]> => {
        const { data } = await axios.get(
            `Projects?plantId=${plantId}${apiVersion}`
        );
        return data as Project[];
    };

    const getPermissionsForPlant = async (
        plantId: string
    ): Promise<string[]> => {
        const { data } = await axios.get(
            `Permissions?plantId=${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const getSearchResults = async (
        query: string,
        projectId: number,
        plantId: string,
        searchType: string,
        cancelToken?: CancelToken
    ): Promise<SearchResults> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${query}&includeDecommissioningPkgs=true&projectId=${projectId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/Search?plantId=${plantId}&startsWithTagNo=${query}&projectId=${projectId}${apiVersion}`;
        } else {
            throw new Error('An error occurred, please try again.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isOfType<SearchResults>(data, 'maxAvailable')) {
            throw new Error(typeGuardErrorMessage('search results'));
        }
        return data;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        cancelToken: CancelToken
    ): Promise<CommPkg | Tag> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getAttachments = async (
        cancelToken: CancelToken,
        endpoint: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(`${endpoint}${apiVersion}`, {
            cancelToken: cancelToken,
        });
        return data as Attachment[];
    };

    //------------
    // CHECKLIST
    // -----------

    const getScope = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        cancelToken: CancelToken
    ): Promise<ChecklistPreview[]> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg/Checklists?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/CheckLists?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen entity type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfType<ChecklistPreview>(data, 'hasElectronicForm')) {
            throw new Error(typeGuardErrorMessage('checklist preview'));
        }
        const filteredChecklists = data.filter(
            (checklist) => checklist.formularGroup != 'MCCR'
        );
        return filteredChecklists;
    };

    const getChecklist = async (
        plantId: string,
        checklistId: string,
        cancelToken: CancelToken
    ): Promise<ChecklistResponse> => {
        const { data } = await axios.get(
            `Checklist/Comm?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            { cancelToken }
        );
        return data as ChecklistResponse;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string,
        cancelToken: CancelToken
    ): Promise<PunchPreview[]> => {
        const { data } = await axios.get(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchPreview>(data, 'cleared')) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const postSetOk = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postSetNA = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/SetNA?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const postClear = async (
        plantId: string,
        checklistId: string,
        checkItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/Item/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
            }
        );
    };

    const putMetaTableStringCell = async (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
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
    };

    const putMetaTableDateCell = async (
        plantId: string,
        checklistId: string,
        checkItemId: number,
        columnId: number,
        rowId: number,
        value: string
    ): Promise<void> => {
        await axios.put(
            `CheckList/Item/MetaTableCellDate?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CheckItemId: checkItemId,
                ColumnId: columnId,
                RowId: rowId,
                Value: value,
            }
        );
    };

    const putChecklistComment = async (
        plantId: string,
        checklistId: string,
        Comment: string
    ): Promise<void> => {
        await axios.put(
            `CheckList/Comm/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
    };

    const postSign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const postUnsign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const getChecklistAttachments = async (
        plantId: string,
        checklistId: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32${apiVersion}`
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
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
        cancelToken: CancelToken,
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            { data: dto, cancelToken: cancelToken }
        );
    };

    const postChecklistAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps): Promise<void> => {
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

    //------------
    // PUNCH ITEMS
    // -----------

    const getPunchList = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        cancelToken: CancelToken
    ): Promise<PunchPreview[]> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg/PunchList?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/PunchList?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await axios.get(url, { cancelToken });
        if (!isArrayOfType<PunchPreview>(data, 'isRestrictedForUser')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getPunchCategories = async (
        plantId: string
    ): Promise<PunchCategory[]> => {
        const { data } = await axios.get(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchCategory[];
    };

    const getPunchTypes = async (plantId: string): Promise<PunchType[]> => {
        const { data } = await axios.get(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchType[];
    };

    const getPunchOrganizations = async (
        plantId: string
    ): Promise<PunchOrganization[]> => {
        const { data } = await axios.get(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`
        );
        return data as PunchOrganization[];
    };

    const postNewPunch = async (
        plantId: string,
        newPunchData: NewPunch
    ): Promise<void> => {
        await axios.post(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
    };

    const getPunchItem = async (
        plantId: string,
        punchItemId: string
    ): Promise<PunchItem> => {
        const { data } = await axios.get(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`
        );
        return data as PunchItem;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemId: string,
        updateData: UpdatePunchData,
        endpoint: UpdatePunchEndpoint
    ): Promise<void> => {
        const dto = { PunchItemId: punchItemId, ...updateData };
        await axios.put(
            `PunchListItem/${endpoint}?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    // Used for clearing, unclearing, rejecting and verifying a
    const postPunchAction = async (
        plantId: string,
        punchItemId: string,
        punchAction: PunchAction
    ): Promise<void> => {
        await axios.post(
            `PunchListItem/${punchAction}?plantId=PCS$${plantId}${apiVersion}`,
            punchItemId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    //---------
    // TASKS
    //---------

    const getTasks = async (
        plantId: string,
        commPkgId: string,
        cancelToken: CancelToken
    ): Promise<TaskPreview[]> => {
        const { data } = await axios.get(
            `CommPkg/Tasks?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as TaskPreview[];
    };

    const getTask = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<Task> => {
        const { data } = await axios.get(
            `CommPkg/Task?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as Task;
    };

    const postTaskSign = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Sign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                cancelToken: cancelToken,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const postTaskUnsign = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                cancelToken: cancelToken,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const putTaskComment = async (
        cancelToken: CancelToken,
        plantId: string,
        dto: TaskCommentDto
    ): Promise<void> => {
        await axios.put(
            `CommPkg/Task/Comment?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { cancelToken: cancelToken }
        );
    };

    const getTaskParameters = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<TaskParameter[]> => {
        const { data } = await axios.get(
            `CommPkg/Task/Parameters?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as TaskParameter[];
    };

    const putTaskParameter = async (
        plantId: string,
        dto: TaskParameterDto
    ): Promise<void> => {
        await axios.put(
            `CommPkg/Task/Parameters/Parameter?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskAttachments = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `CommPkg/Task/Attachments?plantId=PCS$${plantId}&taskId=${taskId}&thumbnailSize=32${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as Attachment[];
    };

    const getTaskAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CommPkg/Task/Attachment?plantId=PCS$${plantId}&taskId=${taskId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
                responseType: 'blob',
                headers: {
                    'Content-Disposition':
                        'attachment; filename="filename.jpg"',
                },
            }
        );
        return data as Blob;
    };

    const getPunchAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        punchItemId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            {
                cancelToken: cancelToken,
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
        cancelToken: CancelToken,
        plantId: string,
        punchItemId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            PunchItemId: parseInt(punchItemId),
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            { data: dto, cancelToken: cancelToken }
        );
    };

    const postTempPunchAttachment = async ({
        plantId,
        parentId,
        data: formData,
        title,
    }: PostAttachmentProps): Promise<string> => {
        const { data } = await axios.post(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        type TempAttachmentReturn = { id: string };
        function dataHasId(data: unknown): data is TempAttachmentReturn {
            return (data as TempAttachmentReturn)['id'] !== undefined;
        }
        if (dataHasId(data)) {
            return data.id as string;
        } else {
            throw new Error('Unable to upload attachment');
        }
    };

    const postPunchAttachment = async ({
        plantId,
        parentId,
        data,
        title,
    }: PostAttachmentProps): Promise<void> => {
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
        getChecklistPunchList,
        getEntityDetails,
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
        putMetaTableStringCell,
        putMetaTableDateCell,
        putTaskComment,
        putTaskParameter,
        putUpdatePunch,
        getSearchResults,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
