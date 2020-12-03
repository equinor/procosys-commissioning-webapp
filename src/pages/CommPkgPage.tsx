import React, { useContext } from 'react';
import CommPkgDetailsCard from '../components/commPkg/CommPkgDetailsCard';
import CommPackageContext from '../contexts/CommPackageContext';
import CommPkgFooter from '../components/commPkg/CommPkgFooter';
import {
    Route,
    Switch,
    useHistory,
    useParams,
    useRouteMatch,
} from 'react-router-dom';
import Scope from '../components/commPkg/Scope';
import Tasks from '../components/commPkg/Tasks';
import PunchList from '../components/commPkg/PunchList';
import { CommParams } from '../App';

const CommPkgPage = () => {
    const { details } = useContext(CommPackageContext);
    const { params } = useRouteMatch();
    const { plant, project, commPkg } = useParams<CommParams>();
    const { location } = useHistory();
    console.log('Location: ', location);
    return (
        <>
            <CommPkgDetailsCard
                MCStatus={details.mcStatus}
                commStatus={details.commStatus}
                description={details.description}
                pkgNumber={details.commPkgNo}
            />
            <Switch>
                <Route
                    exact
                    path={`${plant}/${project}/${commPkg}/scope`}
                    component={Scope}
                />
                <Route
                    exact
                    path={`${plant}/${project}/${commPkg}/tasks`}
                    component={Tasks}
                />
                <Route
                    exact
                    path={`${plant}/${project}/${commPkg}/punch-list`}
                    component={PunchList}
                />
            </Switch>
            <CommPkgFooter
                numberOfChecklists={4212}
                numberOfPunches={10}
                numberOfTasks={100}
            />
        </>
    );
};

export default CommPkgPage;
