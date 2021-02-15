import React, { useEffect, useState } from 'react';
import DetailsCard from './DetailsCard';
import NavigationFooter from './NavigationFooter';
import { Redirect, Route, Switch } from 'react-router-dom';
import Scope from './Scope/Scope';
import Tasks from './Tasks/Tasks';
import PunchList from './PunchList/PunchList';
import Navbar from '../../components/navigation/Navbar';
import styled from 'styled-components';
import { calculateHighestStatus } from '../../utils/general';
import useCommonHooks from '../../utils/useCommonHooks';
import { AsyncStatus } from '../../contexts/CommAppContext';
import {
    ChecklistPreview,
    TaskPreview,
    PunchPreview,
} from '../../services/apiTypes';
import { DotProgress } from '@equinor/eds-core-react';
import NavigationFooterShell from './NavigationFooterShell';

const CommPkgWrapper = styled.main``;

const CommPkg = () => {
    const { api, params, path } = useCommonHooks();
    const [scope, setScope] = useState<ChecklistPreview[]>();
    const [tasks, setTasks] = useState<TaskPreview[]>();
    const [punchList, setPunchList] = useState<PunchPreview[]>();
    const [fetchFooterDataStatus, setFetchFooterDataStatus] = useState(
        AsyncStatus.LOADING
    );

    useEffect(() => {
        (async () => {
            try {
                const [
                    scopeFromApi,
                    tasksFromApi,
                    punchListFromApi,
                ] = await Promise.all([
                    api.getScope(params.plant, params.commPkg),
                    api.getTasks(params.plant, params.commPkg),
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
    }, [api, params.plant, params.commPkg]);

    const determineFooterToRender = () => {
        if (
            fetchFooterDataStatus === AsyncStatus.SUCCESS &&
            tasks &&
            scope &&
            punchList
        ) {
            return (
                <NavigationFooter
                    numberOfChecklists={scope.length}
                    numberOfPunches={punchList.length}
                    numberOfTasks={tasks.length}
                    status={calculateHighestStatus(punchList)}
                />
            );
        }
        if (fetchFooterDataStatus === AsyncStatus.ERROR) {
            return (
                <NavigationFooterShell>
                    <p>Unable to load footer. Please reload</p>
                </NavigationFooterShell>
            );
        }
        return (
            <NavigationFooterShell>
                <DotProgress variant="green" />
            </NavigationFooterShell>
        );
    };

    return (
        <CommPkgWrapper>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Bookmarks' }}
            />
            <DetailsCard commPkgId={params.commPkg} />
            <Switch>
                <Redirect exact path={path} to={`${path}/scope`} />
                <Route exact path={`${path}/scope`} component={Scope} />
                <Route exact path={`${path}/tasks`} component={Tasks} />
                <Route
                    exact
                    path={`${path}/punch-list`}
                    component={PunchList}
                />
            </Switch>
            {determineFooterToRender()}
        </CommPkgWrapper>
    );
};

export default CommPkg;
