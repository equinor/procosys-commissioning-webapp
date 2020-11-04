import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SearchPage from './components/pages/SearchPage';
import SelectProject from './components/pages/SelectProject';
import { ParamTypes } from './App';
import SelectPlant from './components/pages/SelectPlant';

const CommRouter = () => {
    const { path } = useRouteMatch();
    const { plant } = useParams<ParamTypes>();
    console.log(path);
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
