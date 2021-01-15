import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CommPkgContextProvider } from './contexts/CommPkgContext';
import Checklist from './pages/Checklist/Checklist';
import CommPkg from './pages/CommPkg/CommPkg';
import NewPunch from './pages/NewPunch/NewPunch';

const CommPkgRouter = () => {
    const { path } = useRouteMatch();
    return (
        <CommPkgContextProvider>
            <Switch>
                <Route
                    exact
                    path={`${path}/scope/:checklistId`}
                    component={Checklist}
                />
                <Route
                    exact
                    path={`${path}/scope/:checklistId/new-punch`}
                    component={NewPunch}
                />
                <Route path={path} component={CommPkg} />
            </Switch>
        </CommPkgContextProvider>
    );
};

export default CommPkgRouter;
