import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject';
import SearchPage from './pages/SearchPage';
import SelectPlant from './pages/SelectPlant';
import Navbar from './components/navigation/Navbar';

const CommRouter = () => {
    const { path } = useRouteMatch();
    return (
        <PlantContextProvider>
            <Navbar />
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route path={`${path}/:project`} component={SearchPage} />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
