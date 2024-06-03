import {
  AsyncStatus,
  ChosenPerson,
  NewPunch,
  isArrayOfType,
  removeSubdirectories,
  useFormFields,
  useSnackbar
} from "@equinor/procosys-webapp-components";
import {
  OrganizationDetail,
  PriorityAndSorting
} from "@equinor/procosys-webapp-components/dist/typings/apiTypes";
import Axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AsyncPage from "../../components/AsyncPage";
import PlantContext from "../../contexts/PlantContext";
import {
  LibrayTypes,
  NewPunch as NewPunchDtoType,
  PunchCategory,
  Type
} from "../../typings/apiTypes";
import useCommonHooks from "../../utils/useCommonHooks";
import usePersonsSearchFacade from "../../utils/usePersonsSearchFacade";

const newPunchInitialValues = {
  category: "",
  description: "",
  raisedBy: "",
  clearingBy: "",
  actionByPerson: null,
  dueDate: "",
  type: "",
  sorting: "",
  priority: "",
  estimate: ""
};

const NewPunchWrapper = (): JSX.Element => {
  const { api, params, url, history, completionApi } = useCommonHooks();
  const { availableProjects } = useContext(PlantContext);
  const currentProject = availableProjects?.find(
    (p) => p.title === params.project
  );
  const { formFields, createChangeHandler } = useFormFields(
    newPunchInitialValues
  );
  const [categories, setCategories] = useState<PunchCategory[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDetail[]>([]);
  const [sortings, setSortings] = useState<PriorityAndSorting[]>([]);
  const [priorities, setPriorities] = useState<PriorityAndSorting[]>([]);
  const [chosenPerson, setChosenPerson] = useState<ChosenPerson>({
    id: null,
    name: ""
  });
  const [fetchNewPunchStatus, setFetchNewPunchStatus] = useState(
    AsyncStatus.LOADING
  );
  const [submitPunchStatus, setSubmitPunchStatus] = useState(
    AsyncStatus.INACTIVE
  );
  const { snackbar, setSnackbarText } = useSnackbar();
  const [tempIds, setTempIds] = useState<string[]>([]);
  const source = Axios.CancelToken.source();
  const { hits, searchStatus, query, setQuery } = usePersonsSearchFacade();
  const checkListGuid = location.search.split("checkListGuid=").at(1);

  const getLibraryTypes = useCallback(async () => {
    const categoriesFromApi = await api
      .getPunchCategories(params.plant, source.token)
      .catch(() => setFetchNewPunchStatus(AsyncStatus.ERROR));

    const libraryTypes = await completionApi
      .getLibraryTypes(params.plant, source.token)
      .catch(() => setFetchNewPunchStatus(AsyncStatus.ERROR));

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
    setFetchNewPunchStatus(AsyncStatus.SUCCESS);
  }, [params.plant]);

  useEffect(() => {
    getLibraryTypes();
    return (): void => {
      source.cancel();
    };
  }, [params.plant, api]);

  useEffect(() => {
    if (submitPunchStatus === AsyncStatus.SUCCESS) {
      history.push(`${removeSubdirectories(url, 1)}${location.search}`);
    }
  }, [submitPunchStatus]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!currentProject || !checkListGuid) return;
    const NewPunchDTO: NewPunchDtoType = {
      checkListGuid,
      projectGuid: currentProject.proCoSysGuid,
      category: formFields.category,
      description: formFields.description,
      typeGuid: formFields.type,
      raisedByOrgGuid: formFields.raisedBy,
      clearingByOrgGuid: formFields.clearingBy,
      sortingGuid: formFields.sorting,
      priorityGuid: formFields.priority,
      estimate: parseInt(formFields.estimate),
      dueTimeUtc: formFields.dueDate
        ? new Date(formFields.dueDate).toISOString()
        : undefined,
      actionByPersonOid: chosenPerson.id ? `${chosenPerson.id}` : ""
    };
    setSubmitPunchStatus(AsyncStatus.LOADING);
    try {
      await completionApi.postNewPunch(params.plant, NewPunchDTO);
      setSubmitPunchStatus(AsyncStatus.SUCCESS);
    } catch (error) {
      const pcsError = error as Error;
      setSnackbarText(pcsError.toString());
      setSubmitPunchStatus(AsyncStatus.ERROR);
    }
  };

  return (
    <>
      <AsyncPage
        fetchStatus={fetchNewPunchStatus}
        errorMessage={
          "Unable to load new punch. Please check your connection, permissions, or refresh this page."
        }
        loadingMessage={"Loading new punch."}
      >
        <NewPunch
          formFields={formFields}
          createChangeHandler={createChangeHandler}
          categories={categories}
          organizations={organizations}
          types={types}
          sortings={sortings}
          priorities={priorities}
          handleSubmit={handleSubmit}
          submitPunchStatus={submitPunchStatus}
          plantId={params.plant}
          chosenPerson={chosenPerson}
          setChosenPerson={setChosenPerson}
          fetchNewPunchStatus={fetchNewPunchStatus}
          setTempIds={setTempIds}
          postTempAttachment={api.postTempPunchAttachment}
          hits={hits}
          searchStatus={searchStatus}
          query={query}
          setQuery={setQuery}
          disableAttahments
        />
      </AsyncPage>
      {snackbar}
    </>
  );
};

export default NewPunchWrapper;
