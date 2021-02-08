import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CommPkgContext from '../contexts/CommPkgContext';
import PlantContext from '../contexts/PlantContext';
import CommAppContext, { AsyncStatus } from '../contexts/CommAppContext';
import * as Msal from '@azure/msal-browser';
import {
    ChecklistPreview,
    CommPkg,
    Plant,
    Project,
    PunchPreview,
    TaskPreview,
} from '../services/apiTypes';
import baseApiService from '../services/baseApi';
import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import authService from '../services/__mocks__/authService';
import {
    testProjects,
    testPlants,
    testDetails,
    testScope,
    testTasks,
    testPunchList,
} from './dummyData';
import { IAuthService } from '../services/authService';

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});

const authInstance = authService({ MSAL: client, scopes: ['testScope'] });
const baseApiInstance = baseApiService(authInstance, 'https://dummy-url.com', [
    'testscope',
]);
const procosysApiInstance = procosysApiService({ axios: baseApiInstance });

type WithCommAppContextProps = {
    Component: JSX.Element;
    asyncStatus?: AsyncStatus;
    plants?: Plant[];
    auth?: IAuthService;
    api?: ProcosysApiService;
};

export const withCommAppContext = ({
    Component,
    asyncStatus = AsyncStatus.SUCCESS,
    plants = testPlants,
    auth = authInstance,
    api = procosysApiInstance,
}: WithCommAppContextProps) => {
    return (
        <Router>
            <CommAppContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                    auth: auth,
                    api: api,
                }}
            >
                {Component}
            </CommAppContext.Provider>
        </Router>
    );
};

type WithPlantContextProps = {
    Component: JSX.Element;
    fetchProjectsAndPermissionsStatus?: AsyncStatus;
    permissions?: string[];
    currentPlant?: Plant | undefined;
    availableProjects?: Project[] | null;
    currentProject?: Project | undefined;
    setCurrentProject?: (project: Project) => void;
};

export const withPlantContext = ({
    fetchProjectsAndPermissionsStatus = AsyncStatus.SUCCESS,
    availableProjects = testProjects,
    currentPlant = testPlants[1],
    currentProject = testProjects[1],
    Component,
}: WithPlantContextProps) => {
    return withCommAppContext({
        Component: (
            <PlantContext.Provider
                value={{
                    fetchProjectsAndPermissionsStatus: fetchProjectsAndPermissionsStatus,
                    permissions: [],
                    currentPlant: currentPlant,
                    availableProjects: availableProjects,
                    currentProject: currentProject,
                }}
            >
                {Component}
            </PlantContext.Provider>
        ),
    });
};

type CommPkgContextProps = {
    Component: JSX.Element;
    details?: CommPkg;
    scope?: ChecklistPreview[];
    tasks?: TaskPreview[];
    punchList?: PunchPreview[];
};

export const withCommPkgContext = ({
    Component,
    details = testDetails,
    scope = testScope,
    tasks = testTasks,
    punchList = testPunchList,
}: CommPkgContextProps) => {
    return withPlantContext({
        Component: (
            <CommPkgContext.Provider
                value={{
                    details,
                    scope,
                    tasks,
                    punchList,
                }}
            >
                {Component}
            </CommPkgContext.Provider>
        ),
    });
};
