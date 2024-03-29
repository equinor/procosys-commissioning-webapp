import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import useCommonHooks from '../../utils/useCommonHooks';
import {
    AsyncStatus,
    ChosenPerson,
    NewPunch,
    removeSubdirectories,
    useFormFields,
    useSnackbar,
} from '@equinor/procosys-webapp-components';
import AsyncPage from '../../components/AsyncPage';
import usePersonsSearchFacade from '../../utils/usePersonsSearchFacade';
import {
    PunchCategory,
    PunchType,
    PunchOrganization,
    PunchSort,
    PunchPriority,
    NewPunch as NewPunchDtoType,
} from '../../typings/apiTypes';

const newPunchInitialValues = {
    category: '',
    description: '',
    raisedBy: '',
    clearingBy: '',
    actionByPerson: null,
    dueDate: '',
    type: '',
    sorting: '',
    priority: '',
    estimate: '',
};

const NewPunchWrapper = (): JSX.Element => {
    const { api, params, url, history } = useCommonHooks();
    const { formFields, createChangeHandler } = useFormFields(
        newPunchInitialValues
    );
    const [categories, setCategories] = useState<PunchCategory[]>([]);
    const [types, setTypes] = useState<PunchType[]>([]);
    const [organizations, setOrganizations] = useState<PunchOrganization[]>([]);
    const [sortings, setSortings] = useState<PunchSort[]>([]);
    const [priorities, setPriorities] = useState<PunchPriority[]>([]);
    const [chosenPerson, setChosenPerson] = useState<ChosenPerson>({
        id: null,
        name: '',
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

    useEffect(() => {
        (async (): Promise<void> => {
            try {
                const [
                    categoriesFromApi,
                    typesFromApi,
                    organizationsFromApi,
                    sortsFromApi,
                    prioritiesFromApi,
                ] = await Promise.all([
                    api.getPunchCategories(params.plant, source.token),
                    api.getPunchTypes(params.plant, source.token),
                    api.getPunchOrganizations(params.plant, source.token),
                    api.getPunchSorts(params.plant, source.token),
                    api.getPunchPriorities(params.plant, source.token),
                ]);
                setCategories(categoriesFromApi);
                setTypes(typesFromApi);
                setOrganizations(organizationsFromApi);
                setSortings(sortsFromApi);
                setPriorities(prioritiesFromApi);
                setFetchNewPunchStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                setFetchNewPunchStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [params.plant, api]);

    useEffect(() => {
        if (submitPunchStatus === AsyncStatus.SUCCESS) {
            history.push(removeSubdirectories(url, 1));
        }
    }, [submitPunchStatus]);

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const NewPunchDTO: NewPunchDtoType = {
            CheckListId: parseInt(params.checklistId),
            CategoryId: parseInt(formFields.category),
            Description: formFields.description,
            TypeId: parseInt(formFields.type),
            RaisedByOrganizationId: parseInt(formFields.raisedBy),
            ClearingByOrganizationId: parseInt(formFields.clearingBy),
            SortingId: parseInt(formFields.sorting),
            PriorityId: parseInt(formFields.priority),
            Estimate: parseInt(formFields.estimate),
            DueDate: formFields.dueDate,
            ActionByPerson: chosenPerson.id,
            TemporaryFileIds: tempIds,
        };
        setSubmitPunchStatus(AsyncStatus.LOADING);
        try {
            await api.postNewPunch(params.plant, NewPunchDTO);
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
                    'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
                }
                loadingMessage={'Loading new punch.'}
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
                />
            </AsyncPage>
            {snackbar}
        </>
    );
};

export default NewPunchWrapper;
