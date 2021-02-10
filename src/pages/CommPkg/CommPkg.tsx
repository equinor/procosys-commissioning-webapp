import React, { useContext } from 'react';
import DetailsCard from './DetailsCard';
import CommPkgContext from '../../contexts/CommPkgContext';
import NavigationFooter from './NavigationFooter';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Scope from './Scope/Scope';
import Tasks from './Tasks/Tasks';
import PunchList from './PunchList/PunchList';
import Navbar from '../../components/navigation/Navbar';
import styled from 'styled-components';
import { calculateHighestStatus } from '../../utils/general';

const CommPkgWrapper = styled.main`
    /* padding-top: 12px; */
`;

const CommPkg = () => {
    const { details, scope, punchList, tasks } = useContext(CommPkgContext);
    const { path } = useRouteMatch();
    return (
        <CommPkgWrapper>
            <Navbar
                noBorder
                leftContent={{ name: 'back', label: 'Bookmarks' }}
            />
            <DetailsCard
                details={{
                    MCStatus: details.mcStatus,
                    commStatus: details.commStatus,
                    description: details.description,
                    pkgNumber: details.commPkgNo,
                }}
            />
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
            <NavigationFooter
                numberOfChecklists={scope.length}
                numberOfPunches={punchList.length}
                numberOfTasks={tasks.length}
                status={calculateHighestStatus(punchList)}
            />
        </CommPkgWrapper>
    );
};

export default CommPkg;
