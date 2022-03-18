import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PlantContextProvider } from './contexts/PlantContext';
import SelectProject from './pages/SelectProject/SelectProject';
import Search from './pages/Search/Search';
import SelectPlant from './pages/SelectPlant/SelectPlant';
import NewPunch from './pages/Punch/NewPunch/NewPunch';
import ClearPunch from './pages/Punch/ClearPunch/ClearPunch';
import VerifyPunch from './pages/Punch/VerifyPunch/VerifyPunch';
import Checklist from './pages/Checklist/ChecklistPage';
import Task from './pages/Task/Task';
import EntityPage from './pages/EntityPage/EntityPage';

const CommRouter = (): JSX.Element => {
    return (
        <PlantContextProvider>
            <Switch>
                <Route exact path={'/'} component={SelectPlant} />
                <Route exact path={'/:plant'} component={SelectProject} />
                <Route exact path={'/:plant/:project'} component={Search} />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/punch-list/:punchItemId/clear`}
                    component={ClearPunch}
                />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchitemId/clear`}
                    component={ClearPunch}
                />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/punch-list/:punchItemId/verify`}
                    component={VerifyPunch}
                />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/checklist/:checklistId/punch-item/:punchItemId/verify`}
                    component={VerifyPunch}
                />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/checklist/:checklistId/new-punch`}
                    component={NewPunch}
                />
                <Route
                    path={`/:plant/:project/:searchType/:entityId/checklist/:checklistId`}
                    component={Checklist}
                />
                <Route
                    exact
                    path={`/:plant/:project/:searchType/:entityId/tasks/:taskId`}
                    component={Task}
                />

                <Route
                    path={'/:plant/:project/:searchType/:entityId'}
                    component={EntityPage}
                />
            </Switch>
        </PlantContextProvider>
    );
};

export default CommRouter;
