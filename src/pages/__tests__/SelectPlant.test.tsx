import React from 'react';
import { AsyncStatus } from '../../contexts/UserContext';
import { testPlants, withUserContext } from '../../test/contexts';
import SelectPlant from '../SelectPlant';

describe('<SelectPlant />', () => {
    it('Renders plant buttons successfully upon loading', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.SUCCESS,
            testPlants
        );
        expect(getByText(testPlants[0].title)).toBeInTheDocument();
    });
    it('Renders loading page while fetching available plants', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.LOADING,
            testPlants
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
