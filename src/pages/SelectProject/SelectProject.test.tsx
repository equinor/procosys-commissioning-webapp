import React from 'react';
import { AsyncStatus } from '../../contexts/UserContext';
import { testProjects, withPlantContext } from '../../test/contexts';
import SelectProject from '../SelectProject/SelectProject';

describe('<SelectProject />', () => {
    it('Renders project buttons successfully upon loading', () => {
        const { getByText } = withPlantContext({
            Component: <SelectProject />,
            fetchProjectsAndPermissionsStatus: AsyncStatus.SUCCESS,
        });
        expect(getByText(testProjects[0].title)).toBeInTheDocument();
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
