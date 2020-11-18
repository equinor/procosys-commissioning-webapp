import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import { ParamTypes } from './App';
import SelectProject from './pages/SelectProject';
import SearchPage from './pages/SearchPage';

const CommRouter = () => {
    const { path } = useRouteMatch();
    const { plant } = useParams<ParamTypes>();
    return (
        <PlantContextProvider>
            <Switch key={plant}>
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route path={`${path}/:project`} component={SearchPage} />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
