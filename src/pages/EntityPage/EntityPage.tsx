import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Tasks from './Tasks/Tasks';
import styled from 'styled-components';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
} from '../../services/apiTypes';
import { DotProgress } from '@equinor/eds-core-react';
import withAccessControl from '../../services/withAccessControl';
import Axios from 'axios';
import calculateHighestStatus from '../../utils/calculateHighestStatus';
import {
    BackButton,
    FooterButton,
    Navbar,
    NavigationFooter,
    removeSubdirectories,
    Scope,
} from '@equinor/procosys-webapp-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';
import DetailsCard from '../../components/CommPkgDetailsCard/DetailsCard';
import { SearchType } from '../Search/Search';
import EntityPageDetailsCard from './EntityPageDetailsCard';
import PunchList from './PunchList/PunchList';

const CommPkgWrapper = styled.main``;

const ContentWrapper = styled.div`
    padding-bottom: 66px;
`;

const CommPkg = (): JSX.Element => {
    const { api, params, path, url, history } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchScopeStatus, setFetchScopeStatus] = useState(
        AsyncStatus.LOADING
    );
    const [fetchPunchListStatus, setFetchPunchListStatus] = useState(
        AsyncStatus.LOADING
    );
    const source = Axios.CancelToken.source();

    useEffect(() => {
        if (params.searchType === SearchType.Comm) {
            (async (): Promise<void> => {
                try {
                    const tasksFromApi = await api.getTasks(
                        params.plant,
                        params.entityId,
                        source.token
                    );
                    setTasks(tasksFromApi);
                } catch {
                    setFetchFooterDataStatus(AsyncStatus.ERROR);
                }
            })();
        }
    }, [api, params]);

    useEffect(() => {
        (async (): Promise<void> => {
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
                if (scopeFromApi.length > 0) {
                    setFetchScopeStatus(AsyncStatus.SUCCESS);
                } else {
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
            } catch {
                setFetchFooterDataStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params]);

    return (
        <CommPkgWrapper>
            <Navbar
                noBorder
                leftContent={<BackButton to={removeSubdirectories(url, 2)} />}
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
                                renderFilter={
                                    params.searchType === SearchType.Tag
                                }
                            />
                        )}
                    />
                    <Route exact path={`${path}/tasks`} component={Tasks} />
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
                </Switch>
            </ContentWrapper>
            <NavigationFooter footerStatus={fetchFooterDataStatus}>
                <FooterButton
                    active={
                        !history.location.pathname.includes('/punch-list') &&
                        !history.location.pathname.includes('/tasks')
                    }
                    goTo={(): void => history.push(url)}
                    icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                    label="Scope"
                    numberOfItems={scope?.length}
                />
                {history.location.pathname.includes('/Comm') ? (
                    <FooterButton
                        active={history.location.pathname.includes('/tasks')}
                        goTo={(): void => history.push(`${url}/tasks`)}
                        icon={<EdsIcon name="list" color={COLORS.mossGreen} />}
                        label="Tasks"
                        numberOfItems={tasks?.length}
                    />
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
        </CommPkgWrapper>
    );
};

export default withAccessControl(CommPkg, [
    'COMMPKG/READ',
    'CPCL/READ',
    'RUNNING_LOGS/READ',
    'DOCUMENT/READ',
    'PUNCHLISTITEM/READ',
]);
