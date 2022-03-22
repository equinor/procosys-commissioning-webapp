import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { causeApiError, ENDPOINTS } from '../../../test/setupServer';
import NewPunch from './NewPunch';
describe('<NewPunch/> loading errors', () => {
    it('Renders an error message if unable to load checklist details', async () => {
        render(withPlantContext({ Component: <NewPunch /> }));
        causeApiError(ENDPOINTS.getChecklist, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
    it('Renders an error message if unable to load punch categories', async () => {
        render(withPlantContext({ Component: <NewPunch /> }));
        causeApiError(ENDPOINTS.getPunchCategories, 'get');
        const errorMessage = await screen.findByText(
            'Unable to load new punch. Please check your connection, permissions, or refresh this page.'
        );
        expect(errorMessage).toBeInTheDocument();
    });
});
