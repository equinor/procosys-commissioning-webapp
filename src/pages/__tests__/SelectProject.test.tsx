import { render } from '@testing-library/react';
import React from 'react';
import { AsyncStatus } from '../../contexts/UserContext';
import SelectProject from '../SelectProject';
import { BrowserRouter as Router } from 'react-router-dom';
import { Project } from '../../services/api';
import PlantContext from '../../contexts/PlantContext';
import { plants } from './SelectPlant.test';

const projects: Project[] = [
    { id: 1, title: 'Test project 1', description: 'this-is-a-description' },
    { id: 2, title: 'Test project 2', description: 'yet-another-description' },
];

const withUserContext = (
    Component: JSX.Element,
    asyncStatus: AsyncStatus,
    projects: Project[]
) => {
    return render(
        <Router>
            <PlantContext.Provider
                value={{
                    currentProject: projects[1],
                    setCurrentProject: () => {},
                    availableProjects: projects,
                    fetchProjectsAndPermissionsStatus: asyncStatus,
                    permissions: [],
                    currentPlant: plants[0],
                }}
            >
                {Component}
            </PlantContext.Provider>
        </Router>
    );
};

describe('<SelectProject />', () => {
    it('Renders project buttons successfully upon loading', () => {
        const { getByText } = withUserContext(
            <SelectProject />,
            AsyncStatus.SUCCESS,
            projects
        );
        expect(getByText(projects[0].title)).toBeInTheDocument();
    });
    it('Renders loading page while fetching available projects', () => {
        const { getByText } = withUserContext(
            <SelectProject />,
            AsyncStatus.LOADING,
            projects
        );
        expect(getByText(/Loading/)).toBeInTheDocument();
    });
    it('Renders no projects to show placeholder if there are no projects available', () => {
        const { getByText } = withUserContext(
            <SelectProject />,
            AsyncStatus.SUCCESS,
            []
        );
        expect(getByText('No projects to show')).toBeInTheDocument();
    });
    it('Displays error message when unable to fetch projects', () => {
        const { getByText } = withUserContext(
            <SelectProject />,
            AsyncStatus.ERROR,
            []
        );
        expect(getByText('Error: Unable to load projects')).toBeInTheDocument();
    });
});
