import React from 'react';
import { AsyncStatus } from '../../contexts/CommAppContext';
import { testPlants, withUserContext } from '../../test/contexts';
import SelectPlant from './SelectPlant';

describe('<SelectPlant />', () => {
    it('Renders plant buttons successfully upon loading', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.SUCCESS,
            testPlants
        );
        expect(getByText(testPlants[0].title)).toBeInTheDocument();
    });
    it('Renders placeholder if there are no plants available', () => {
        const { getByText } = withUserContext(
            <SelectPlant />,
            AsyncStatus.SUCCESS,
            []
        );
        expect(getByText('No plants to show')).toBeInTheDocument();
    });
});
