import { withPlantContext } from '../../../test/contexts';
import React from 'react';
import PunchList from './PunchList';
import { screen, render, waitFor } from '@testing-library/react';

const renderPunchList = () => {
    render(
        withPlantContext({
            Component: <PunchList />,
        })
    );
};

describe('<PunchList />', () => {
    test.todo(
        'Renders placeholder text when an empty punch list is returned from API'
    );
    test.todo('Renders error page');
    it('Renders a punch preview button', async () => {
        renderPunchList();
        expect(
            await screen.findByText('dummy-punch-item-description')
        ).toBeInTheDocument();
    });
});
