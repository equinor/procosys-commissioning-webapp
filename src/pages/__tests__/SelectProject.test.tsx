import { render } from '@testing-library/react';
import React from 'react';
import { AsyncStatus } from '../../contexts/UserContext';
import SelectProject from '../SelectProject';
import { BrowserRouter as Router } from 'react-router-dom';
import PlantContext from '../../contexts/PlantContext';
import { plants } from './SelectPlant.test';
import { Plant, Project } from '../../services/apiTypes';

export const projects: Project[] = [
    { id: 1, title: 'Test project 1', description: 'this-is-a-description' },
    { id: 2, title: 'Test project 2', description: 'yet-another-description' },
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
    availableProjects = projects,
    currentPlant = plants[1],
    currentProject = projects[1],
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

describe('<SelectProject />', () => {
    it('Renders project buttons successfully upon loading', () => {
        const { getByText } = withPlantContext({
            Component: <SelectProject />,
            fetchProjectsAndPermissionsStatus: AsyncStatus.SUCCESS,
        });
        expect(getByText(projects[0].title)).toBeInTheDocument();
    });
    it('Renders loading page while fetching available projects', () => {
        const { getByText } = withPlantContext({
            Component: <SelectProject />,
            fetchProjectsAndPermissionsStatus: AsyncStatus.LOADING,
        });
        expect(getByText(/Loading/)).toBeInTheDocument();
    });
    it('Renders no projects to show placeholder if there are no projects available', () => {
        const { getByText } = withPlantContext({
            Component: <SelectProject />,
            fetchProjectsAndPermissionsStatus: AsyncStatus.SUCCESS,
            availableProjects: [],
        });
        expect(getByText('No projects to show')).toBeInTheDocument();
    });
    it('Displays error message when unable to fetch projects', () => {
        const { getByText } = withPlantContext({
            Component: <SelectProject />,
            fetchProjectsAndPermissionsStatus: AsyncStatus.ERROR,
            availableProjects: [],
        });
        expect(getByText('Error: Unable to load projects')).toBeInTheDocument();
    });
});
