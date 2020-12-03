import React, { useContext } from 'react';
import CommPkgDetailsCard from '../components/commPkg/CommPkgDetailsCard';
import CommPackageContext from '../contexts/CommPackageContext';
import CommPkgFooter from '../components/commPkg/CommPkgFooter';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Scope from '../components/commPkg/Scope';
import Tasks from '../components/commPkg/Tasks';
import PunchList from '../components/commPkg/PunchList';

const CommPkgPage = () => {
    const { details, scope, punchList, tasks } = useContext(CommPackageContext);
    const { path } = useRouteMatch();
    return (
        <>
            <CommPkgDetailsCard
                MCStatus={details.mcStatus}
                commStatus={details.commStatus}
                description={details.description}
                pkgNumber={details.commPkgNo}
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
            <CommPkgFooter
                numberOfChecklists={scope.length}
                numberOfPunches={tasks.length}
                numberOfTasks={punchList.length}
            />
        </>
    );
};

export default CommPkgPage;