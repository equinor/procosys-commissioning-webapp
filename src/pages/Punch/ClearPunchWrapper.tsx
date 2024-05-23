import {
  AsyncStatus,
  ClearPunch,
  PunchAction,
  PunchEndpoints,
  UpdatePunchData,
  isArrayOfType,
  useSnackbar
} from "@equinor/procosys-webapp-components";
import Axios, { AxiosError, AxiosResponse } from "axios";
import React, { Dispatch, useCallback, useEffect, useState } from "react";
import {
  Attachment,
  LibrayTypes,
  PunchCategory,
  PunchItem
} from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";
import usePersonsSearchFacade from "../../utils/usePersonsSearchFacade";

const punchEndpints: PunchEndpoints = {
  updateCategory: "UpdateCategory",
  updateDescription: "/Description",
  updateRaisedBy: "/RaisedByOrgGuid",
  updateClearingBy: "/ClearingByOrgGuid",
  updateActionByPerson: "/ActionByPersonOid",
  updateDueDate: "/DueTimeUtc",
  updateType: "/TypeGuid",
  updateSorting: "/SortingGuid",
  updatePriority: "/PriorityGuid",
  updateEstimate: "/Estimate"
};

type ClearPunchWrapperProps = {
  punchItem: PunchItem;
  setPunchItem: React.Dispatch<React.SetStateAction<PunchItem>>;
  canEdit: boolean;
  canClear: boolean;
  setRowVersion: Dispatch<React.SetStateAction<string | undefined>>;
};
type Queue = {
  patchDocument?: UpdatePunchData;
  rowVersion: string;
  category?: string;
};

const ClearPunchWrapper = ({
  punchItem,
  setPunchItem,
  canEdit,
  canClear
}: // setRowVersion
ClearPunchWrapperProps): JSX.Element => {
  const {
    api,
    params,
    history,
    url,
    completionApi,
    completionBaseApiInstance
  } = useCommonHooks();
  const [updateQueue, setUpdateQueue] = useState<Queue[]>([]);
  const [rowVersion, setRowVersion] = useState<string>();
  const { snackbar, setSnackbarText } = useSnackbar();
  const [categories, setCategories] = useState<PunchCategory[]>([]);
  const [types, setTypes] = useState<LibrayTypes[]>([]);
  const [organizations, setOrganizations] = useState<LibrayTypes[]>([]);
  const [sortings, setSortings] = useState<LibrayTypes[]>([]);
  const [priorities, setPriorities] = useState<LibrayTypes[]>([]);
  const [fetchOptionsStatus, setFetchOptionsStatus] = useState(
    AsyncStatus.INACTIVE
  );
  const [updatePunchStatus, setUpdatePunchStatus] = useState(
    AsyncStatus.INACTIVE
  );
  const [clearPunchStatus, setClearPunchStatus] = useState(
    AsyncStatus.INACTIVE
  );
  const source = Axios.CancelToken.source();
  const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();

  const getLibraryTypes = useCallback(async () => {
    const categoriesFromApi = await api
      .getPunchCategories(params.plant, source.token)
      .catch(() => setFetchOptionsStatus(AsyncStatus.ERROR));

    const libraryTypes = await completionApi
      .getLibraryTypes(params.plant, source.token)
      .catch(() => setFetchOptionsStatus(AsyncStatus.ERROR));

    if (isArrayOfType<LibrayTypes>(libraryTypes, "guid")) {
      const types = libraryTypes.reduce((acc, type) => {
        const group = acc.get(type.libraryType) || [];
        acc.set(type.libraryType, [...group, type]);
        return acc;
      }, new Map());

      setOrganizations(types.get("COMPLETION_ORGANIZATION"));
      setTypes(types.get("PUNCHLIST_TYPE"));
      setSortings(types.get("PUNCHLIST_SORTING"));
      setPriorities(types.get("PUNCHLIST_PRIORITY"));
    }
    if (isArrayOfType<PunchCategory>(categoriesFromApi, "id")) {
      setCategories(categoriesFromApi);
    }
    setFetchOptionsStatus(AsyncStatus.SUCCESS);
  }, [params.plant]);

  useEffect(() => {
    getLibraryTypes();
    return (): void => {
      source.cancel();
    };
  }, [params.plant, api, params.punchItemId]);

  useEffect(() => {
    if (punchItem) setRowVersion(punchItem.rowVersion);
  }, []);

  const processQueue = useCallback(async () => {
    if (updatePunchStatus === AsyncStatus.LOADING) {
      return;
    }
    setUpdatePunchStatus(AsyncStatus.LOADING);
    const { patchDocument, category } = updateQueue[0];
    const data = category
      ? { category, rowVersion }
      : { patchDocument, rowVersion };
    const updatedData: AxiosResponse<string> | void =
      await completionBaseApiInstance
        .patch(
          `PunchItems/${punchItem?.guid}${
            category ? `/${punchEndpints.updateCategory}` : ""
          }`,
          data,
          { headers: { "x-plant": `PCS$${params.plant}` } }
        )
        .catch((error: AxiosError) => {
          setUpdatePunchStatus(AsyncStatus.ERROR);
          setSnackbarText(error.message);
        })
        .finally(() => {
          setSnackbarText("Saved successfully");
          setUpdatePunchStatus(AsyncStatus.SUCCESS);
        });
    setUpdateQueue((prevQueue) => prevQueue.slice(1));
    if (updatedData?.data) {
      setRowVersion(updatedData.data);
    }
  }, [updatePunchStatus, updateQueue, rowVersion]);

  useEffect(() => {
    if (
      updatePunchStatus !== AsyncStatus.ERROR &&
      updatePunchStatus !== AsyncStatus.LOADING &&
      updateQueue.length
    ) {
      processQueue();
    }
  }, [updatePunchStatus, updateQueue, rowVersion]);

  const updateDatabase = useCallback(
    async (endpoint: string, updateData: UpdatePunchData): Promise<void> => {
      setUpdateQueue((prev: any) => [
        ...prev,
        endpoint === punchEndpints.updateCategory
          ? { category: updateData, rowVersion }
          : {
              patchDocument: [
                { value: updateData, path: endpoint, op: "replace" }
              ],
              rowVersion
            }
      ]);
    },
    [rowVersion, updatePunchStatus]
  );

  const clearPunch = async (): Promise<void> => {
    if (!rowVersion) return;
    setClearPunchStatus(AsyncStatus.LOADING);
    try {
      const data = await completionApi.postPunchAction(
        params.plant,
        params.punchItemId,
        PunchAction.CLEAR,
        rowVersion
      );
      const clearedPunch = await completionApi.getPunchItem(
        params.plant,
        params.punchItemId
      );
      setPunchItem(clearedPunch);
      setRowVersion(data);
      setClearPunchStatus(AsyncStatus.SUCCESS);
    } catch (error) {
      setClearPunchStatus(AsyncStatus.ERROR);
    }
  };

  return (
    <ClearPunch
      plantId={params.plant}
      punchItem={punchItem}
      setPunchItem={setPunchItem}
      canEdit={canEdit}
      canClear={canClear}
      punchEndpoints={punchEndpints}
      updateDatabase={updateDatabase}
      organizations={organizations}
      categories={categories}
      types={types}
      sortings={sortings}
      priorities={priorities}
      clearPunchStatus={clearPunchStatus}
      setClearPunchStatus={setClearPunchStatus}
      clearPunch={clearPunch}
      redirectAfterClearing={(): void => {
        history.push(url);
      }}
      fetchOptionsStatus={fetchOptionsStatus}
      updatePunchStatus={updatePunchStatus}
      getPunchAttachments={(
        plantId: string,
        guid: string
      ): Promise<Attachment[]> => {
        return completionApi.getPunchAttachments(plantId, guid);
      }}
      getPunchAttachment={(
        plantId: string,
        punchGuid: string,
        attachmentGuid: string
      ): Promise<Blob> => {
        return completionApi.getPunchAttachment(
          source.token,
          plantId,
          punchGuid,
          attachmentGuid
        );
      }}
      postPunchAttachment={completionApi.postPunchAttachment}
      deletePunchAttachment={completionApi.deletePunchAttachment}
      getPunchComments={completionApi.getPunchComments}
      postPunchComment={completionApi.postPunchComment}
      snackbar={snackbar}
      setSnackbarText={setSnackbarText}
      hits={hits}
      searchStatus={searchStatus}
      query={query}
      setQuery={setQuery}
    />
  );
};

export default ClearPunchWrapper;
