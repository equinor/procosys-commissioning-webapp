import {
  AsyncStatus,
  ClearPunch,
  PunchAction,
  PunchEndpoints,
  UpdatePunchData,
  isArrayOfType,
  useSnackbar
} from "@equinor/procosys-webapp-components";
import Axios from "axios";
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
  updateCategory: "SetCategory",
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

const ClearPunchWrapper = ({
  punchItem,
  setPunchItem,
  canEdit,
  canClear,
  setRowVersion
}: ClearPunchWrapperProps): JSX.Element => {
  const { api, params, history, url, completionApi } = useCommonHooks();
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

  const updateDatabase = async (
    endpoint: string,
    updateData: UpdatePunchData
  ): Promise<void> => {
    setUpdatePunchStatus(AsyncStatus.LOADING);
    setSnackbarText("Saving change.");
    try {
      await completionApi.putUpdatePunch(
        params.plant,
        params.punchItemId,
        updateData,
        endpoint,
        punchItem.rowVersion
      );
      setUpdatePunchStatus(AsyncStatus.SUCCESS);
      setSnackbarText("Change successfully saved.");
      const updatedPunch = await completionApi.getPunchItem(
        params.plant,
        punchItem.guid
      );
      setPunchItem(updatedPunch);
    } catch (error) {
      const pcsError = error as Error;
      setUpdatePunchStatus(AsyncStatus.ERROR);
      setSnackbarText(pcsError.toString());
    }
  };

  const clearPunch = async (): Promise<void> => {
    setClearPunchStatus(AsyncStatus.LOADING);
    try {
      const rowVersion = await completionApi.postPunchAction(
        params.plant,
        params.punchItemId,
        PunchAction.CLEAR,
        punchItem.rowVersion
      );
      setRowVersion(rowVersion);
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
      postPunchAttachment={api.postPunchAttachment}
      deletePunchAttachment={api.deletePunchAttachment}
      getPunchComments={completionApi.getPunchComments}
      postPunchComment={api.postPunchComment}
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
