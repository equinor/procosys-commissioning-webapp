import {
  PunchAction,
  UpdatePunchData,
  isArrayOfType
} from "@equinor/procosys-webapp-components";
import { AxiosInstance, CancelToken } from "axios";
import {
  NewPunch,
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
    punchItemId: string,
    updateData: UpdatePunchData,
    endpoint: string
  ): Promise<void> => {
    const dto = { PunchItemId: punchItemId, ...updateData };
    await axios.put(`PunchItems/${endpoint}`, dto, { ...headers(plantId) });
  };

  // Used for clearing, unclearing, rejecting and verifying a
  const postPunchAction = async (
    plantId: string,
    punchItemId: string,
    punchAction: PunchAction
  ): Promise<void> => {
    await axios.post(`PunchListItem/${punchAction}`, { ...headers(plantId) });
  };

  return {
    getPunchList,
    getPunchTypes,
    getPunchOrganizations,
    getPunchSorts,
    getPunchPriorities,
    postNewPunch,
    putUpdatePunch,
    getPunchItem,
    postPunchAction
  };
};

export type CompletionApiService = ReturnType<typeof completionApiService>;
export default completionApiService;
