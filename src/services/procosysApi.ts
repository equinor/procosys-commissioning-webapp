import {
    isArrayOfType,
    isOfType,
    PunchAction,
    UpdatePunchData,
} from '@equinor/procosys-webapp-components';
import objectToCamelCase from '../utils/objectToCamelCase';
import { AxiosInstance, CancelToken } from 'axios';
import { SearchType } from '../pages/Search/Search';
import { TaskCommentDto } from '../pages/Task/TaskDescription';
import { TaskParameterDto } from '../pages/Task/TaskParameters/TaskParameters';
import { isCorrectDetails, isArrayofPerson } from '../typings/apiTypeGuards';
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
    EntityId,
} from '../typings/apiTypes';
import { HTTPError } from './HTTPError';

const typeGuardErrorMessage = (expectedType: string): string => {
    return `Unable to retrieve ${expectedType}. Please try again.`;
};

type ProcosysApiServiceProps = {
    baseURL: string;
    apiVersion: string;
};

type GetOperationProps = {
    abortSignal?: AbortSignal;
    method: string;
    headers: any;
    responseType?: string;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const procosysApiService = (
    { baseURL, apiVersion }: ProcosysApiServiceProps,
    token: string
) => {
    // General
    const callback = (resultObj: any, apiPath: string): string => resultObj;

    const getVersion = (): string => {
        return apiVersion;
    };

    const getByFetch = async (
        url: string,
        abortSignal?: AbortSignal
    ): Promise<any> => {
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const res = await fetch(`${baseURL}/${url}`, GetOperation);
        if (res.ok) {
            const jsonResult = await res.json();
            const resultObj = objectToCamelCase(jsonResult);
            callback(resultObj, res.url);
            return resultObj;
        } else {
            console.error('Get by fetch failed. Url=' + url, res);
            throw new HTTPError(res.status, res.statusText);
        }
    };

    /**
     * Generic method for doing a GET call with attachment blob as response.
     */
    const getAttachmentByFetch = async (
        url: string,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const GetOperation: GetOperationProps = {
            abortSignal: abortSignal,
            method: 'GET',
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Disposition': 'attachment; filename="filename.jpg"',
            },
        };

        const res = await fetch(`${baseURL}/${url}`, GetOperation);

        if (res.ok) {
            const blob = await res.blob();

            //ArrayBuffer must be used for storing in indexeddb (blob not supported by all browser, and not supported by Dexie-encrypted)
            const arrayBuffer = await blob.arrayBuffer();
            callback(arrayBuffer, res.url);
            return blob;
        } else {
            console.error('Get attachment by fetch failed. Url=' + url, res);
            throw new HTTPError(res.status, res.statusText);
        }
    };

    /**
     * Generic method for doing a DELETE call. Should be used by all DELETE calls.
     */
    const deleteByFetch = async (url: string, data?: any): Promise<any> => {
        const DeleteOperation = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: data ? JSON.stringify(data) : null,
        };
        const response = await fetch(`${baseURL}/${url}`, DeleteOperation);

        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    /**
     * Generic method for doing a POST call with json as body data.
     * If the request fails because of http error code from server, HTTPError will be thrown.
     * If the request fails because of network issues etc, Error will be thrown.
     */
    const postByFetch = async (url: string, bodyData?: any): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        };

        let response = new Response();
        try {
            response = await fetch(`${baseURL}/${url}`, PostOperation);
        } catch (error) {
            console.error(
                'Something went wrong when accessing the server.',
                error
            );
            throw new Error('Something went wrong when accessing the server.');
        }

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return await response.json();
            } else {
                return;
            }
        } else {
            const errorMessage = await getErrorMessage(response);
            console.error('Error occured on postByFetch', errorMessage);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    /**
     * Generic method for posting attachment with form data as body data.
     */
    const postAttachmentByFetch = async (
        url: string,
        file: FormData,
        returnId: boolean
    ): Promise<any> => {
        const PostOperation = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: file,
        };
        const response = await fetch(`${baseURL}/${url}`, PostOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
        if (returnId == true) {
            const jsonResult = await response.json();
            const resultObj = objectToCamelCase(jsonResult);
            callback(resultObj, response.url);
            return resultObj;
        }
    };

    /**
     * Generic method for doing a PUT call.
     */
    const putByFetch = async (
        url: string,
        bodyData: any,
        additionalHeaders?: any
    ): Promise<any> => {
        const PutOperation = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                ...additionalHeaders,
            },
            body: JSON.stringify(bodyData),
        };
        const response = await fetch(`${baseURL}/${url}`, PutOperation);
        if (!response.ok) {
            const errorMessage = await getErrorMessage(response);
            throw new HTTPError(response.status, errorMessage);
        }
    };

    const getErrorMessage = async (response: Response): Promise<string> => {
        let errorMessage;
        const text = await response.text();
        if (text) {
            errorMessage = text;
        } else {
            errorMessage = `Server responded with http error code ${response.status}. ${response.statusText}`;
        }
        console.error('Error occured on server call.', errorMessage);
        return errorMessage;
    };

    const getPlants = async (): Promise<Plant[]> => {
        const plants = await getByFetch(
            `Plants?includePlantsWithoutAccess=false${apiVersion}`
        );
        if (!isArrayOfType<Plant>(plants, 'title')) {
            throw new Error(typeGuardErrorMessage('plants'));
        }
        const plantsWithSlug: Plant[] = plants.map((plant: Plant) => ({
            ...plant,
            slug: plant.id.substring(4),
        }));
        return plantsWithSlug;
    };

    const getProjectsForPlant = async (plantId: string): Promise<Project[]> => {
        const data = await getByFetch(
            `Projects?plantId=${plantId}${apiVersion}`
        );
        if (!isArrayOfType<Project>(data, 'title')) {
            throw new Error(typeGuardErrorMessage('projects'));
        }
        return data;
    };

    const getPermissionsForPlant = async (
        plantId: string
    ): Promise<string[]> => {
        const data = await getByFetch(
            `Permissions?plantId=${plantId}${apiVersion}`
        );
        return data as string[];
    };

    const getSearchResults = async (
        query: string,
        projectId: number,
        plantId: string,
        searchType: string,
        abortSignal: AbortSignal
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
        const data = await getByFetch(url, abortSignal);
        if (!isOfType<SearchResults>(data, 'maxAvailable')) {
            throw new Error(typeGuardErrorMessage('search results'));
        }
        return data;
    };

    const getEntityDetails = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        abortSignal: AbortSignal
    ): Promise<CommPkg | Tag> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const data = await getByFetch(url, abortSignal);
        if (!isCorrectDetails(data, searchType)) {
            throw new Error(typeGuardErrorMessage('details'));
        }
        return data;
    };

    const getAttachments = async (
        abortSignal: AbortSignal,
        endpoint: string
    ): Promise<Attachment[]> => {
        const { data } = await getByFetch(
            `${endpoint}${apiVersion}`,
            abortSignal
        );
        return data as Attachment[];
    };

    //------------
    // CHECKLIST
    // -----------

    const getScope = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        abortSignal?: AbortSignal
    ): Promise<ChecklistPreview[]> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg/Checklists?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/CheckLists?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen entity type is not supported.');
        }
        const data = await getByFetch(url, abortSignal);
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
        abortSignal?: AbortSignal
    ): Promise<ChecklistResponse> => {
        const data = await getByFetch(
            `CheckList/MC?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal
        );
        return data;
    };

    const getChecklistPunchList = async (
        plantId: string,
        checklistId: string,
        abortSignal?: AbortSignal
    ): Promise<PunchPreview[]> => {
        const { data } = await getByFetch(
            `CheckList/PunchList?plantId=PCS$${plantId}&checklistId=${checklistId}${apiVersion}`,
            abortSignal
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
        await postByFetch(
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
        await postByFetch(
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
        await postByFetch(
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
        await putByFetch(
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
        await putByFetch(
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
        await putByFetch(
            `CheckList/Comm/Comment?plantId=PCS$${plantId}${apiVersion}`,
            { CheckListId: checklistId, Comment: Comment }
        );
    };

    const postSign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/Comm/Sign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const postUnsign = async (
        plantId: string,
        checklistId: string
    ): Promise<void> => {
        await postByFetch(
            `CheckList/Comm/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            checklistId
        );
    };

    const getChecklistAttachments = async (
        plantId: string,
        checklistId: string
    ): Promise<Attachment[]> => {
        const { data } = await getByFetch(
            `CheckList/Attachments?plantId=PCS$${plantId}&checkListId=${checklistId}&thumbnailSize=32${apiVersion}`
        );
        return data as Attachment[];
    };

    const getChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const data = await getAttachmentByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
        );
        return data as Blob;
    };

    const deleteChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        attachmentId: number
    ): Promise<void> => {
        const dto = {
            CheckListId: parseInt(checklistId),
            AttachmentId: attachmentId,
        };
        await deleteByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&api-version=4.1`,
            dto
        );
    };

    const postChecklistAttachment = async (
        plantId: string,
        checklistId: string,
        data: FormData,
        title?: string
    ): Promise<void> => {
        await postAttachmentByFetch(
            `CheckList/Attachment?plantId=PCS$${plantId}&checkListId=${checklistId}&title=${title}${apiVersion}`,
            data,
            false
        );
    };

    //------------
    // PUNCH ITEMS
    // -----------

    const getPunchList = async (
        plantId: string,
        searchType: SearchType,
        entityId: string,
        abortSignal: AbortSignal
    ): Promise<PunchPreview[]> => {
        let url = '';
        if (searchType === SearchType.Comm) {
            url = `CommPkg/PunchList?plantId=PCS$${plantId}&commPkgId=${entityId}${apiVersion}`;
        } else if (searchType === SearchType.Tag) {
            url = `Tag/PunchList?plantId=PCS$${plantId}&tagId=${entityId}${apiVersion}`;
        } else {
            throw new Error('The chosen scope type is not supported.');
        }
        const { data } = await getByFetch(url, abortSignal);
        if (!isArrayOfType<PunchPreview>(data, 'isRestrictedForUser')) {
            throw new Error(typeGuardErrorMessage('punch preview'));
        }
        return data;
    };

    const getPunchCategories = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchCategory[]> => {
        const data = await getByFetch(
            `PunchListItem/Categories?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchCategory>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch categories'));
        }
        return data;
    };

    const getPunchTypes = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchType[]> => {
        const data = await getByFetch(
            `PunchListItem/Types?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchType>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch types'));
        }
        return data;
    };

    const getPunchOrganizations = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchOrganization[]> => {
        const data = await getByFetch(
            `PunchListItem/Organizations?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchOrganization>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch organizations'));
        }
        return data;
    };

    const getPunchSorts = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchSort[]> => {
        const data = await getByFetch(
            `PunchListItem/Sorts?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchSort>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch sorts'));
        }
        return data;
    };

    const getPunchPriorities = async (
        plantId: string,
        abortSignal: AbortSignal
    ): Promise<PunchPriority[]> => {
        const data = await getByFetch(
            `PunchListItem/Priorities?plantId=PCS$${plantId}${apiVersion}`,
            abortSignal
        );
        if (!isArrayOfType<PunchPriority>(data, 'code')) {
            throw new Error(typeGuardErrorMessage('punch priorities'));
        }
        return data;
    };

    const getPersonsByName = async (
        plantId: string,
        searchString: string,
        abortSignal: AbortSignal
    ): Promise<Person[]> => {
        const data = await getByFetch(
            `Person/PersonSearch?plantId=${plantId}&searchString=${searchString}${apiVersion}`,
            abortSignal
        );
        if (!isArrayofPerson(data)) {
            throw new Error('An error occurred, please try again.');
        }
        return data;
    };

    const postNewPunch = async (
        plantId: string,
        newPunchData: NewPunch
    ): Promise<EntityId> => {
        const punchId = await postByFetch(
            `PunchListItem?plantId=PCS$${plantId}${apiVersion}`,
            newPunchData
        );
        return punchId;
    };

    const getPunchItem = async (
        plantId: string,
        punchItemId: string,
        abortSignal?: AbortSignal
    ): Promise<PunchItem> => {
        const data = await getByFetch(
            `PunchListItem?plantId=PCS$${plantId}&punchItemId=${punchItemId}${apiVersion}`,
            abortSignal
        );
        if (!isOfType<PunchItem>(data, 'raisedByCode')) {
            throw new Error(typeGuardErrorMessage('punchItem'));
        }
        return data;
    };

    const putUpdatePunch = async (
        plantId: string,
        punchItemId: string,
        updateData: UpdatePunchData,
        endpoint: string
    ): Promise<void> => {
        const dto = { PunchItemId: punchItemId, ...updateData };
        await putByFetch(
            `PunchListItem/${endpoint}?plantId=PCS$${plantId}${apiVersion}`,
            dto,
            { 'Content-Type': 'application/json' }
        );
    };

    // Used for clearing, unclearing, rejecting and verifying a
    const postPunchAction = async (
        plantId: string,
        punchItemId: string,
        punchAction: PunchAction
    ): Promise<void> => {
        await postByFetch(
            `PunchListItem/${punchAction}?plantId=PCS$${plantId}${apiVersion}`,
            punchItemId
        );
    };

    //---------
    // TASKS
    //---------

    const getTasks = async (
        plantId: string,
        commPkgId: string,
        abortSignal?: AbortSignal
    ): Promise<TaskPreview[]> => {
        const { data } = await getByFetch(
            `CommPkg/Tasks?plantId=PCS$${plantId}&commPkgId=${commPkgId}${apiVersion}`,
            abortSignal
        );
        return data as TaskPreview[];
    };

    const getTask = async (
        plantId: string,
        taskId: string,
        abortSignal?: AbortSignal
    ): Promise<Task> => {
        const { data } = await getByFetch(
            `CommPkg/Task?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            abortSignal
        );
        return data as Task;
    };

    const postTaskSign = async (
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await postByFetch(
            `CommPkg/Task/Sign?plantId=PCS$${plantId}${apiVersion}`,
            taskId
        );
    };

    const postTaskUnsign = async (
        plantId: string,
        taskId: string
    ): Promise<void> => {
        await postByFetch(
            `CommPkg/Task/Unsign?plantId=PCS$${plantId}${apiVersion}`,
            taskId
        );
    };

    const putTaskComment = async (
        plantId: string,
        dto: TaskCommentDto
    ): Promise<void> => {
        await putByFetch(
            `CommPkg/Task/Comment?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskParameters = async (
        plantId: string,
        taskId: string,
        abortSignal?: AbortSignal
    ): Promise<TaskParameter[]> => {
        const { data } = await getByFetch(
            `CommPkg/Task/Parameters?plantId=PCS$${plantId}&taskId=${taskId}${apiVersion}`,
            abortSignal
        );
        return data as TaskParameter[];
    };

    const putTaskParameter = async (
        plantId: string,
        dto: TaskParameterDto
    ): Promise<void> => {
        await putByFetch(
            `CommPkg/Task/Parameters/Parameter?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const getTaskAttachments = async (
        plantId: string,
        taskId: string,
        abortSignal?: AbortSignal
    ): Promise<Attachment[]> => {
        const { data } = await getByFetch(
            `CommPkg/Task/Attachments?plantId=PCS$${plantId}&taskId=${taskId}&thumbnailSize=32${apiVersion}`,
            abortSignal
        );
        return data as Attachment[];
    };

    const getTaskAttachment = async (
        plantId: string,
        taskId: string,
        attachmentId: number,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const { data } = await getByFetch(
            `CommPkg/Task/Attachment?plantId=PCS$${plantId}&taskId=${taskId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
        );
        return data as Blob;
    };

    const getPunchAttachments = async (
        plantId: string,
        punchItemId: number,
        abortSignal?: AbortSignal
    ): Promise<Attachment[]> => {
        const data = await getByFetch(
            `PunchListItem/Attachments?plantId=PCS$${plantId}&punchItemId=${punchItemId}&thumbnailSize=128${apiVersion}`,
            abortSignal
        );
        return data as Attachment[];
    };

    const getPunchAttachment = async (
        plantId: string,
        punchItemId: number,
        attachmentId: number,
        abortSignal?: AbortSignal
    ): Promise<Blob> => {
        const { data } = await getByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchItemId}&attachmentId=${attachmentId}${apiVersion}`,
            abortSignal
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
        await deleteByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}${apiVersion}`,
            dto
        );
    };

    const postTempPunchAttachment = async (
        plantId: string,
        file: FormData,
        title: string
    ): Promise<string> => {
        const data = await postAttachmentByFetch(
            `PunchListItem/TempAttachment?plantId=PCS$${plantId}${apiVersion}`,
            file,
            true
        );
        console.log('data: ', data);
        return data.id as string;
    };

    const postPunchAttachment = async (
        plantId: string,
        punchId: number,
        file: FormData,
        title: string
    ): Promise<void> => {
        await postAttachmentByFetch(
            `PunchListItem/Attachment?plantId=PCS$${plantId}&punchItemId=${punchId}&title=${title}${apiVersion}`,
            file,
            false
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
