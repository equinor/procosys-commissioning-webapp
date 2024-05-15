import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Tasks from './Tasks/Tasks';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
} from '../../typings/apiTypes';
import withAccessControl from '../../services/withAccessControl';
import Axios, { CancelToken } from 'axios';
import {
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    removeSubdirectories,
    Scope,
    Document,
} from '@equinor/procosys-webapp-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import { SearchType } from '../Search/Search';
import EntityPageDetailsCard from './EntityPageDetailsCard';
import PunchList from './PunchList/PunchList';
import useAsyncGet from '../../utils/useAsyncGet';
import Documents from './Documents/Documents';

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const CommPkg = (): JSX.Element => {
    const { api, params, path, url, history } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>([]);
    const [tasks, setTasks] = useState<TaskPreview[]>([]);
    const [punchList, setPunchList] = useState<PunchPreview[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );

    const [fetchDocumentsStatus, setFetchDocumentsStatus] =
        useState<AsyncStatus>(AsyncStatus.LOADING);
    const source = Axios.CancelToken.source();

    const fetchTasks = useCallback(
        (cancelToken: CancelToken) =>
            api.getTasks(params.plant, params.entityId, cancelToken),
        [api, params.plant, params.entityId]
    );

    const { response: tasksList, fetchStatus: fetchTaskStatus } =
        useAsyncGet(fetchTasks);

    const isOnScopePage =
        !history.location.pathname.includes('/punch-list') &&
        !history.location.pathname.includes('/documents') &&
        !history.location.pathname.includes('/tasks');

    useEffect(() => {
        const source = Axios.CancelToken.source();

        const fetchTasks = async () => {
            try {
                const tasksFromApi = await api.getTasks(
                    params.plant,
                    params.entityId,
                    source.token
                );
                setTasks(tasksFromApi);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    console.error('Failed to fetch tasks:', error);
                }
            }
        };

        const fetchDocuments = async () => {
            try {
                const documentsFromApi = await api.getDocuments(
                    params.plant,
                    params.entityId,
                    source.token
                );
                setDocuments(documentsFromApi);

                if (documentsFromApi.length === 0) {
                    setFetchFooterDataStatus(AsyncStatus.EMPTY_RESPONSE);
                    setFetchDocumentsStatus(AsyncStatus.EMPTY_RESPONSE);
                } else setFetchDocumentsStatus(AsyncStatus.SUCCESS);
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchFooterDataStatus(AsyncStatus.ERROR);
                }
            }
        };

        if (params.searchType === SearchType.Comm) {
            fetchTasks();
            fetchDocuments();
        }

        return (): void => {
            source.cancel();
        };
    }, [params.plant, params.entityId, params.searchType]);

    useEffect(() => {
        const source = Axios.CancelToken.source();

        const fetchData = async () => {
            try {
                const [scopeFromApi, punchListFromApi] = await Promise.all([
                    api.getScope(
                        params.plant,
                        params.searchType,
                        params.entityId,
                        source.token
                    ),
                    api.getPunchList(
                        params.plant,
                        params.searchType,
                        params.entityId,
                        source.token
                    ),
                ]);

                setScope(scopeFromApi);
                setPunchList(punchListFromApi);

                if (scopeFromApi.length > 0 || punchListFromApi.length > 0) {
                    setFetchFooterDataStatus(AsyncStatus.SUCCESS);
                    setFetchScopeStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchFooterDataStatus(AsyncStatus.EMPTY_RESPONSE);
                    setFetchScopeStatus(AsyncStatus.EMPTY_RESPONSE);
                }
                setPunchList(punchListFromApi);
                if (punchListFromApi.length > 0) {
                    setFetchPunchListStatus(AsyncStatus.SUCCESS);
                } else {
                    setFetchPunchListStatus(AsyncStatus.EMPTY_RESPONSE);
                }
                if (fetchFooterDataStatus != AsyncStatus.ERROR) {
                    setFetchFooterDataStatus(AsyncStatus.SUCCESS);
                }
            } catch (error) {
                if (!Axios.isCancel(error)) {
                    setFetchFooterDataStatus(AsyncStatus.ERROR);
                }
            }
        };

        fetchData();

        return (): void => {
            source.cancel('Component unmounted or params changed');
        };
    }, [params.plant, params.searchType, params.entityId]);

    return (
        <main>
            <Navbar
                noBorder
                leftContent={<BackButton to={removeSubdirectories(url, 2)} />}
                midContent={
                    params.searchType === SearchType.Comm
                        ? 'Comm Package'
                        : params.searchType
                }
            />
            <EntityPageDetailsCard />
            <ContentWrapper>
                <Switch>
                    <Route
                        exact
                        path={`${path}`}
                        render={(): JSX.Element => (
                            <Scope
                                fetchScopeStatus={fetchScopeStatus}
                                onChecklistClick={(checklistId: number): void =>
                                    history.push(
                                        `${history.location.pathname}/checklist/${checklistId}`
                                    )
                                }
                                scope={scope}
                                hideFilter={
                                    params.searchType === SearchType.Comm
                                }
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/tasks`}
                        render={(): JSX.Element => (
                            <Tasks
                                fetchStatus={fetchTaskStatus}
                                tasks={tasksList}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/punch-list`}
                        render={(): JSX.Element => (
                            <PunchList
                                fetchPunchListStatus={fetchPunchListStatus}
                                punchList={punchList}
                            />
                        )}
                    />
                    <Route
                        exact
                        path={`${path}/documents`}
                        render={(): JSX.Element => (
                            <Documents
                                fetchDocumentsStatus={fetchDocumentsStatus}
                                documents={documents}
                            />
                        )}
                    />
                </Switch>
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchFooterDataStatus}>
                <FooterButton
                    active={isOnScopePage}
                    goTo={(): void => history.push(url)}
                    icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                    label="Scope"
                    numberOfItems={scope?.length}
                />
                {history.location.pathname.includes('/Comm') ? (
                    <>
                        <FooterButton
                            active={history.location.pathname.includes(
                                '/documents'
                            )}
                            goTo={(): void => history.push(`${url}/documents`)}
                            icon={
                                <EdsIcon name="list" color={COLORS.mossGreen} />
                            }
                            label="Documents"
                        />
                        <FooterButton
                            active={history.location.pathname.includes(
                                '/tasks'
                            )}
                            goTo={(): void => history.push(`${url}/tasks`)}
                            icon={
                                <EdsIcon name="list" color={COLORS.mossGreen} />
                            }
                            label="Tasks"
                            numberOfItems={tasks?.length}
                        />
                    </>
                ) : (
                    <></>
                )}
                <FooterButton
                    active={history.location.pathname.includes('/punch-list')}
                    goTo={(): void => history.push(`${url}/punch-list`)}
                    icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                    label="Punch list"
                    numberOfItems={punchList?.length}
                />
            </NavigationFooter>
        </main>
    );
};

export default withAccessControl(CommPkg, [
    'COMMPKG/READ',
    'CPCL/READ',
    'RUNNING_LOGS/READ',
    'DOCUMENT/READ',
    'PUNCHLISTITEM/READ',
]);
