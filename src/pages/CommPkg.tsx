import React, { useContext } from 'react';
import DetailsCard from '../components/commPkg/DetailsCard';
import CommPkgContext from '../contexts/CommPkgContext';
import NavigationFooter from '../components/commPkg/NavigationFooter';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Scope from '../components/commPkg/Scope';
import Tasks from '../components/commPkg/Tasks';
import PunchList from '../components/commPkg/PunchList';
import Navbar from '../components/navigation/Navbar';
import styled from 'styled-components';

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
            />
        </CommPkgWrapper>
    );
};

export default CommPkg;
