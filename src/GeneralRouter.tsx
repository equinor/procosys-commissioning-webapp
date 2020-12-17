import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject';
import SearchPage from './pages/SearchPage';
import SelectPlant from './pages/SelectPlant';
import CommPkgRouter from './CommPkgRouter';
import Bookmarks from './pages/Bookmarks';

const CommRouter = () => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={`/:plant/:project`} component={Bookmarks} />
                <Route
                    exact
                    path={`/:plant/:project/search`}
                    component={SearchPage}
                />
                <Route
                    path={`/:plant/:project/:commPkg`}
                    component={CommPkgRouter}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
