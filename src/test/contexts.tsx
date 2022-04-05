import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PlantContext from '../contexts/PlantContext';
import CommAppContext, { AsyncStatus } from '../contexts/CommAppContext';
import * as Msal from '@azure/msal-browser';
import { Plant, Project } from '../typings/apiTypes';
import baseApiService from '../services/baseApi';
import procosysApiService, {
    ProcosysApiService,
} from '../services/procosysApi';
import authService from '../services/__mocks__/authService';
import { testProjects, testPlants, dummyPermissions } from './dummyData';
import { IAuthService } from '../services/authService';
import { baseURL } from './setupServer';
import { AppConfig, FeatureFlags } from '../services/appConfiguration';

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});

const authInstance = authService({ MSAL: client, scopes: ['testScope'] });
const baseApiInstance = baseApiService({
    authInstance,
    baseURL: baseURL,
    scope: ['testscope'],
});
const procosysApiInstance = procosysApiService({
    axios: baseApiInstance,
    apiVersion: 'dummy-version',
});
const dummyAppConfig: AppConfig = {
    procosysWebApi: {
        baseUrl: 'testUrl',
        scope: [''],
        apiVersion: '',
    },
    appInsights: {
        instrumentationKey: '',
    },
    ocrFunctionEndpoint: 'https://dummy-org-endpoint.com',
};
const dummyFeatureFlags: FeatureFlags = {
    commAppIsEnabled: true,
};

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
}: WithCommAppContextProps): JSX.Element => {
    return (
        <MemoryRouter initialEntries={['/test/sub/directory']}>
            <CommAppContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                    auth: auth,
                    api: api,
                    appConfig: dummyAppConfig,
                    featureFlags: dummyFeatureFlags,
                }}
            >
                {Component}
            </CommAppContext.Provider>
        </MemoryRouter>
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
    permissions = dummyPermissions,
    Component,
}: WithPlantContextProps): JSX.Element => {
    return withCommAppContext({
        Component: (
            <PlantContext.Provider
                value={{
                    fetchProjectsAndPermissionsStatus:
                        fetchProjectsAndPermissionsStatus,
                    permissions: permissions,
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
