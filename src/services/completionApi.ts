import {
  APIComment,
  PunchAction,
  UpdatePunchData,
  isArrayOfType
} from "@equinor/procosys-webapp-components";
import { AxiosInstance, CancelToken } from "axios";
import {
  Attachment,
  LibrayTypes,
  NewPunch,
  PunchComment,
  PunchItem,
  PunchOrganization,
  PunchPreview,
  PunchPriority,
  PunchSort,
  PunchType
} from "../typings/apiTypes";

type ProcosysApiServiceProps = {
  axios: AxiosInstance;
};

const headers = (plantId: string, cancelToken?: CancelToken) => {
  return { cancelToken, headers: { "x-plant": `PCS$${plantId}` } };
};

const typeGuardErrorMessage = (expectedType: string): string => {
  return `Unable to retrieve ${expectedType}. Please try again.`;
};

const completionApiService = ({ axios }: ProcosysApiServiceProps) => {
  const getPunchList = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<PunchPreview[]> => {
    let url = "";
    url = "PunchItems";
    const { data } = await axios.get(url, { ...headers(plantId, cancelToken) });
    if (!isArrayOfType<PunchPreview>(data, "isRestrictedForUser")) {
      throw new Error(typeGuardErrorMessage("punch preview"));
    }
    return data;
  };

  const getLibraryTypes = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<LibrayTypes[]> => {
    const { data } = await axios.get(
      `LibraryItems?libraryTypes=PUNCHLIST_TYPE&libraryTypes=COMPLETION_ORGANIZATION&libraryTypes=PUNCHLIST_SORTING&libraryTypes=PUNCHLIST_PRIORITY`,
      {
        ...headers(plantId, cancelToken)
      }
    );
    return data;
  };

  const getPunchTypes = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<PunchType[]> => {
    const { data } = await axios.get(
      `LibraryItems?libraryTypes=PUNCHLIST_TYPE`,
      {
        ...headers(plantId, cancelToken)
      }
    );
    return data as PunchType[];
  };

  const getPunchOrganizations = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<PunchOrganization[]> => {
    const { data } = await axios.get(
      `LibraryItems?libraryTypes=COMPLETION_ORGANIZATION`,
      { ...headers(plantId, cancelToken) }
    );
    return data as PunchOrganization[];
  };

  const getPunchSorts = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<PunchSort[]> => {
    const { data } = await axios.get(
      `LibraryItems?libraryTypes=PUNCHLIST_SORTING`,
      { ...headers(plantId, cancelToken) }
    );
    if (!isArrayOfType<PunchSort>(data, "code")) {
      throw new Error(typeGuardErrorMessage("punch sorts"));
    }
    return data;
  };

  const getPunchPriorities = async (
    plantId: string,
    cancelToken: CancelToken
  ): Promise<PunchPriority[]> => {
    const { data } = await axios.get(
      `LibraryItems?libraryTypes=PUNCHLIST_PRIORITY`,
      { ...headers(plantId, cancelToken) }
    );
    if (!isArrayOfType<PunchPriority>(data, "code")) {
      throw new Error(typeGuardErrorMessage("punch priorities"));
    }
    return data;
  };
  const postNewPunch = async (
    plantId: string,
    newPunchData: NewPunch
  ): Promise<void> => {
    await axios.post(`PunchItems`, newPunchData, { ...headers(plantId) });
  };

  const getPunchItem = async (
    plantId: string,
    punchItemGuid: string
  ): Promise<PunchItem> => {
    const { data } = await axios.get(`PunchItems/${punchItemGuid}`, {
      ...headers(plantId)
    });
    return data as PunchItem;
  };

  const putUpdatePunch = async (
    plantId: string,
    punchItemGuid: string,
    value: UpdatePunchData,
    path: string,
    rowVersion: string
  ): Promise<void> => {
    const dto = {
      rowVersion,
      patchDocument: [{ value, path, op: "replace" }]
    };
    await axios.patch(`PunchItems/${punchItemGuid}`, dto, {
      headers: {
        "Content-Type": "application/json-patch+json",
        "x-plant": `PCS$${plantId}`
      }
    });
  };

  // Used for clearing, unclearing, rejecting and verifying a
  const postPunchAction = async (
    plantId: string,
    punchGuid: string,
    punchAction: PunchAction,
    rowVersion: string
  ): Promise<string> => {
    const { data } = await axios.post(
      `PunchItems/${punchGuid}/${punchAction}`,
      { rowVersion },
      {
        ...headers(plantId)
      }
    );
    return data;
  };

  const getPunchAttachments = async (
    plantId: string,
    guid: string
  ): Promise<Attachment[]> => {
    const { data } = await axios.get(`PunchItems/${guid}/Attachments`, {
      ...headers(plantId)
    });
    return data;
  };

  const getPunchAttachment = async (
    cancelToken: CancelToken,
    plantId: string,
    punchGuid: string,
    attachmentGuid: string
  ): Promise<Blob> => {
    const { data } = await axios.get(
      `PunchItems/${punchGuid}/Attachments/${attachmentGuid}`,
      {
        cancelToken: cancelToken,
        responseType: "blob",
        headers: {
          "x-plant": `PCS$${plantId}`,
          "Content-Disposition": 'attachment; filename="filename.jpg"'
        }
      }
    );
    return data;
  };

  const getPunchComments = async (
    plantId: string,
    guid: string
  ): Promise<APIComment[]> => {
    const { data } = await axios.get(`PunchItems/${guid}/Comments`, {
      ...headers(plantId)
    });
    return data;
  };
  const postPunchComment = async (
    plantId: string,
    guid: string,
    comment: PunchComment
  ): Promise<void> => {
    await axios.post(`PunchItems/${guid}/Comments`, comment, {
      ...headers(plantId)
    });
  };

  const postPunchAttachment = async (
    plantId: string,
    punchItemId: string,
    file: FormData,
    title: string
  ): Promise<void> => {
    await axios.post(`PunchItems/${punchItemId}/Attachments`, file, {
      headers: {
        "x-plant": `PCS$${plantId}`,
        "Content-Type": "multipart/form-data",
        "Content-Disposition": `attachment; filename="${title}"`
      }
    });
  };

  const deletePunchAttachment = async (
    plantId: string,
    punchGuid: string,
    attachmentGuid: string,
    rowVersion: string
  ): Promise<void> => {
    await axios.delete(
      `PunchItems/${punchGuid}/Attachments/${attachmentGuid}`,
      {
        headers: {
          "x-plant": `PCS$${plantId}`,
          "Content-Type": "application/json-patch+json",
          Accept: "application/json"
        },
        data: {
          rowVersion: rowVersion
        }
      }
    );
  };

  return {
    getLibraryTypes,
    getPunchList,
    getPunchTypes,
    getPunchOrganizations,
    getPunchSorts,
    getPunchPriorities,
    postNewPunch,
    putUpdatePunch,
    getPunchItem,
    postPunchAction,
    getPunchAttachments,
    getPunchAttachment,
    getPunchComments,
    postPunchComment,
    deletePunchAttachment,
    postPunchAttachment
  };
};

export type CompletionApiService = ReturnType<typeof completionApiService>;
export default completionApiService;
