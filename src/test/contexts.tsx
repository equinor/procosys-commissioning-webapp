import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CommPkgContext from '../contexts/CommPkgContext';
import PlantContext from '../contexts/PlantContext';
import CommAppContext, { AsyncStatus } from '../contexts/CommAppContext';
import auth from '../services/__mocks__/authService';
import Msal from '@azure/msal-browser';
import {
    ChecklistPreview,
    CommPkg,
    CompletionStatus,
    Plant,
    Project,
    PunchPreview,
    TaskPreview,
} from '../services/apiTypes';
import { IAuthService } from '../services/authService';
import authService from '../services/__mocks__/authService';
import baseApiService from '../services/baseApi';
import procosysApiService from '../services/procosysApi';

export const testPlants: Plant[] = [
    { id: 'One', title: 'Test plant 1', slug: 'this-is-a-slug' },
    { id: 'Two', title: 'Test plant 2', slug: 'yet-another-slug' },
];

export const testProjects: Project[] = [
    { id: 1, title: 'Test project 1', description: 'this-is-a-description' },
    { id: 2, title: 'Test project 2', description: 'yet-another-description' },
];

export const testDetails: CommPkg = {
    id: 1,
    commPkgNo: 'Test commPkgNo',
    description: 'Test commPkg description',
    commStatus: CompletionStatus.OK,
    mcStatus: CompletionStatus.OK,
    mcPkgCount: 1,
    mcPkgsAcceptedByCommissioning: 1,
    mcPkgsAcceptedByOperation: 1,
    commissioningHandoverStatus: 'Test commissioningHandoverStatus',
    operationHandoverStatus: 'Test operationHandoverStatus',
    systemId: 1,
};

export const testTasks: TaskPreview[] = [
    {
        id: 1,
        number: 'Test task number',
        title: 'Test task title',
        chapter: 'Test task chapter',
        isSigned: true,
    },
    {
        id: 2,
        number: 'Test task number 2',
        title: 'Test task title 2',
        chapter: 'Test task chapter 2',
        isSigned: false,
    },
];

export const testScope: ChecklistPreview[] = [
    {
        id: 1,
        tagNo: 'Test tag number',
        tagDescription: 'Test tag description',
        status: CompletionStatus.OK,
        formularGroup: 'Test formular group',
        formularType: 'Test formular type',
        isRestrictedForUser: false,
        hasElectronicForm: true,
    },
];

export const testPunchList: PunchPreview[] = [
    {
        id: 1,
        status: CompletionStatus.OK,
        description: 'Test punch description',
        systemModule: 'Test punch system module',
        tagId: 1,
        tagNo: 'Test tag number',
        tagDescription: 'Test tag description',
        isRestrictedForUser: false,
        cleared: true,
        rejected: false,
        statusControlledBySwcr: true,
    },
];

type withPlantContextProps = {
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
}: withPlantContextProps) => {
    return render(
        <Router>
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
        </Router>
    );
};

const client = new Msal.PublicClientApplication({
    auth: { clientId: 'testId', authority: 'testAuthority' },
});
const authInstance = authService({ MSAL: client, scopes: ['testScope'] });
const baseApiInstance = baseApiService(authInstance, 'http://testbaseurl.com', [
    'testscope',
]);
const procosysApiInstance = procosysApiService({ axios: baseApiInstance });

export const withUserContext = (
    Component: JSX.Element,
    asyncStatus: AsyncStatus,
    plants: Plant[]
) => {
    return render(
        <Router>
            <CommAppContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                    auth: authInstance,
                    api: procosysApiInstance,
                }}
            >
                {Component}
            </CommAppContext.Provider>
        </Router>
    );
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
    return render(
        <Router>
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
        </Router>
    );
};
