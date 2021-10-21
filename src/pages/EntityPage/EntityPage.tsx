import React, { useEffect, useState } from 'react';
import DetailsCard from './DetailsCard';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import Tasks from './Tasks/Tasks';
import PunchList from './PunchList/PunchList';
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
} from '@equinor/procosys-webapp-components';
import EdsIcon from '../../components/icons/EdsIcon';
import { COLORS } from '../../style/GlobalStyles';

const CommPkgWrapper = styled.main``;

const CommPkg = (): JSX.Element => {
    const { api, params, path, url, history } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        const source = Axios.CancelToken.source();
        (async (): Promise<void> => {
            try {
                const [scopeFromApi, tasksFromApi, punchListFromApi] =
                    await Promise.all([
                        api.getScope(params.plant, params.commPkg),
                        api.getTasks(
                            source.token,
                            params.plant,
                            params.commPkg
                        ),
                        api.getPunchList(params.plant, params.commPkg),
                    ]);
                setScope(scopeFromApi);
                setTasks(tasksFromApi);
                setPunchList(punchListFromApi);
                setFetchFooterDataStatus(AsyncStatus.SUCCESS);
            } catch {
                setFetchFooterDataStatus(AsyncStatus.ERROR);
            }
        })();
        return (): void => {
            source.cancel();
        };
    }, [api, params.plant, params.commPkg]);

    return (
        <CommPkgWrapper>
            <Navbar
                noBorder
                leftContent={<BackButton to={removeSubdirectories(url, 2)} />}
            />
            <DetailsCard commPkgId={params.commPkg} />
            <Switch>
                <Route exact path={`${path}`} component={Scope} />
                <Route exact path={`${path}/tasks`} component={Tasks} />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    component={PunchList}
                />
            </Switch>
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
