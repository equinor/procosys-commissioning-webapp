import {
    isArrayOfType,
    isOfType,
    PunchAction,
    Document,
    UpdatePunchData,
} from '@equinor/procosys-webapp-components';
import { CustomCheckItemDto } from '@equinor/procosys-webapp-components/dist/modules/Checklist/CheckItems/CustomCheckItems';
import {
    APIComment,
    PunchComment,
} from '@equinor/procosys-webapp-components/dist/typings/apiTypes';
import { AxiosInstance, CancelToken } from 'axios';
import { SearchType } from '../pages/Search/Search';
import { TaskCommentDto } from '../pages/Task/TaskDescription';
import { TaskParameterDto } from '../pages/Task/TaskParameters/TaskParameters';
import { isCorrectDetails } from '../typings/apiTypeGuards';
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
    PunchPriority,
    PunchSort,
    Person,
} from '../typings/apiTypes';

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
            url = `CommPkg/Search?plantId=${plantId}&startsWithCommPkgNo=${encodeURIComponent(
                query
            )}&includeDecommissioningPkgs=true&projectId=${projectId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/Search?plantId=${plantId}&startsWithTagNo=${encodeURIComponent(
                query
            )}&projectId=${projectId}${apiVersion}`;
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

    const postVerify = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Verify?plantId=PCS$${plantId}${apiVersion}`,
            checklistId,
            { headers: { 'Content-Type': 'application/json' } }
        );
    };

    const postUnverify = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Comm/Unverify?plantId=PCS$${plantId}${apiVersion}`,
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

    const postChecklistAttachment = async (
        plantId: string,
        parentId: number,
        formData: FormData,
        title: string
    ): Promise<void> => {
        await axios.post(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${parentId}&title=${title}${apiVersion}`,
            formData,
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
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchCategory[]> => {
        const { data } = await axios.get(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        return data as PunchCategory[];
    };

    const getPunchTypes = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchType[]> => {
        const { data } = await axios.get(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        return data as PunchType[];
    };

    const getPunchOrganizations = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchOrganization[]> => {
        const { data } = await axios.get(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        return data as PunchOrganization[];
    };

    const getPunchSorts = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchSort[]> => {
        const { data } = await axios.get(
            `PunchListItem/Sorts?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };

    const getPunchPriorities = async (
        plantId: string,
        cancelToken: CancelToken
    ): Promise<PunchPriority[]> => {
        const { data } = await axios.get(
            `PunchListItem/Priorities?plantId=PCS$${plantId}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        cancelToken: CancelToken
    ): Promise<Person[]> => {
        const { data } = await axios.get(
            `Person/PersonSearch?plantId=${plantId}&searchString=${searchString}${apiVersion}`,
            { cancelToken }
        );
        if (!isArrayOfType<Person>(data, 'username')) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
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
        endpoint: string
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

    const postTaskVerify = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Verify?plantId=PCS$${plantId}${apiVersion}`,
            taskId,
            {
                cancelToken: cancelToken,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    };

    const postTaskUnverify = async (
        cancelToken: CancelToken,
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await axios.post(
            `CommPkg/Task/Unverify?plantId=PCS$${plantId}${apiVersion}`,
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

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        cancelToken: CancelToken
    ): Promise<Attachment[]> => {
        const { data } = await axios.get(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            {
                cancelToken: cancelToken,
            }
        );
        return data as Attachment[];
    };

    const getPunchAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        punchItemId: number,
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
        plantId: string,
        punchItemId: number,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            PunchItemId: punchItemId,
            AttachmentId: attachmentId,
        };
        await axios.delete(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            { data: dto }
        );
    };

    const postTempPunchAttachment = async (
        plantId: string,
        formData: FormData,
        title: string
    ): Promise<string> => {
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

    const postPunchAttachment = async (
        plantId: string,
        parentId: number,
        formData: FormData,
        title: string
    ): Promise<void> => {
        await axios.post(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${parentId}&title=${title}${apiVersion}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    };

    const getPunchComments = async (
        plantId: string,
        punchItemId: number
    ): Promise<APIComment[]> => {
        const { data } = await axios.get(
            `PunchListItem/Comments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&${apiVersion}`
        );
        return data;
    };

    const postPunchComment = async (
        plantId: string,
        comment: PunchComment
    ): Promise<void> => {
        await axios.post(
            `PunchListItem/AddComment?plantId=PCS$${plantId}${apiVersion}`,
            comment
        );
    };

    //---------
    // Documents
    //---------

    const getDocuments = async (
        plantId: string,
        commPkgId: string,
        cancelToken: CancelToken
    ): Promise<Document[]> => {
        const { data } = await axios.get(
            `CommPkg/DocumentsWithAttachments?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`,
            { cancelToken: cancelToken }
        );
        return data as Document[];
    };

    const getDocumentAttachment = async (
        cancelToken: CancelToken,
        plantId: string,
        revisionId: string,
        attachmentId: number
    ): Promise<Blob> => {
        const { data } = await axios.get(
            `CommPkg/DocumentsWithAttachments/Attachment?plantId=PCS$${plantId}&revisionId=${revisionId}&attachmentId=${attachmentId}${apiVersion}`,
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

    const postCustomCheckItem = async (
        plantId: string,
        checklistId: string,
        dto: CustomCheckItemDto
    ): Promise<number> => {
        const { data } = await axios.post(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            { ...dto, ChecklistId: checklistId }
        );
        return data.id;
    };

    const getNextCustomItemNumber = async (
        plantId: string,
        checklistId: string,
        cancelToken: CancelToken
    ): Promise<string> => {
        const { data } = await axios.get(
            `CheckList/CustomItem/NextItemNo?plantId=PCS$${plantId}&checkListId=${checklistId}${apiVersion}`,
            { cancelToken }
        );
        return data;
    };

    const deleteCustomCheckItem = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await axios.delete(
            `CheckList/CustomItem?plantId=PCS$${plantId}${apiVersion}`,
            {
                data: {
                    CustomCheckItemId: customCheckItemId,
                    ChecklistId: checklistId,
                },
            }
        );
    };
    const postCustomClear = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/CustomItem/Clear?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };

    const postCustomSetOk = async (
        plantId: string,
        checklistId: string,
        customCheckItemId: number
    ): Promise<void> => {
        await axios.post(
            `CheckList/CustomItem/SetOk?plantId=PCS$${plantId}${apiVersion}`,
            {
                CheckListId: checklistId,
                CustomCheckItemId: customCheckItemId,
            }
        );
    };

    return {
        deleteChecklistAttachment,
        deletePunchAttachment,
        getVersion,
        getAttachments,
        getPunchAttachment,
        getPunchAttachments,
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
        getPunchSorts,
        getPunchPriorities,
        getPersonsByName,
        getPunchList,
        getPunchTypes,
        getPunchCategories,
        getTask,
        getTasks,
        getScope,
        getTaskParameters,
        getDocuments,
        getDocumentAttachment,
        postClear,
        postSetOk,
        postSetNA,
        postNewPunch,
        postPunchAction,
        postTaskSign,
        postTaskUnsign,
        postTaskVerify,
        postTaskUnverify,
        postPunchAttachment,
        postSign,
        postUnsign,
        postVerify,
        postUnverify,
        postTempPunchAttachment,
        postChecklistAttachment,
        putChecklistComment,
        putMetaTableStringCell,
        putMetaTableDateCell,
        putTaskComment,
        putTaskParameter,
        putUpdatePunch,
        getSearchResults,
        getPunchComments,
        postPunchComment,
        postCustomCheckItem,
        getNextCustomItemNumber,
        deleteCustomCheckItem,
        postCustomClear,
        postCustomSetOk,
    };
};

export type ProcosysApiService = ReturnType<typeof procosysApiService>;

export default procosysApiService;
