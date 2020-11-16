import { render } from '@testing-library/react';
import React from 'react';
import { Plant } from '../../../contexts/PlantContext';
import UserContext, { AsyncStatus } from '../../../contexts/UserContext';
import SelectPlant from '../SelectPlant';
import { BrowserRouter as Router } from 'react-router-dom';

export const plants: Plant[] = [
    { id: 'One', title: 'Test plant 1', slug: 'this-is-a-slug' },
    { id: 'Two', title: 'Test plant 2', slug: 'yet-another-slug' },
];

const withUserContext = (
    Component: JSX.Element,
    asyncStatus: AsyncStatus,
    plants: Plant[]
) => {
    return render(
        <Router>
            <UserContext.Provider
                value={{
                    availablePlants: plants,
                    fetchPlantsStatus: asyncStatus,
                }}
            >
                {Component}
            </UserContext.Provider>
        </Router>
    );
};

describe('<SelectPlant />', () => {
    it('Renders plant buttons successfully upon loading', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.SUCCESS,
            plants
        );
        expect(getByText(plants[0].title)).toBeInTheDocument();
    });
    it('Renders loading page while fetching available plants', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.LOADING,
            plants
        );
        expect(getByText(/Loading/)).toBeInTheDocument();
    });
    it('Renders no plants to show placeholder if there are no plants available', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.SUCCESS,
            []
        );
        expect(getByText('No plants to show')).toBeInTheDocument();
    });
    it('Displays error message when unable to fetch plants', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.ERROR,
            []
        );
        expect(getByText('Error: Could not load plants')).toBeInTheDocument();
    });
});
