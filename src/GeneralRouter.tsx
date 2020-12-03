import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject';
import SearchPage from './pages/SearchPage';
import SelectPlant from './pages/SelectPlant';
import Navbar from './components/navigation/Navbar';
import CommPkgRouter from './CommPkgRouter';

const CommRouter = () => {
    return (
        <PlantContextProvider>
            <Navbar />
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={`/:plant/:project`} component={SearchPage} />
                <Route
                    path={`/:plant/:project/:commPkg`}
                    component={CommPkgRouter}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
