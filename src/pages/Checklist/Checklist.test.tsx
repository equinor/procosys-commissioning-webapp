import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../test/contexts';
import Checklist from './Checklist';

// beforeEach(async () => {
//     render(withPlantContext({ Component: <Checklist /> }));
//     await waitFor(() => {
//         expect(screen.getByText('Loading checklist')).toBeInTheDocument();
//     });
// });

describe('<Checklist/>', () => {
    // it('First renders loading screen, then renders checklist details card upon successful loading', async () => {
    //     await expect(
    //         await screen.findByText('dummy-tag-description')
    //     ).toBeInTheDocument();
    // });
    // it('Renders check item header', async () => {
    //     expect(
    //         await screen.findByText('dummy-check-item-header-text')
    //     ).toBeInTheDocument();
    // });
    test.todo('Lets user toggle the check item description');
    test.todo('Shows error screen when unable to load');
    test.todo('Shows banner when checklist is signed');
    test.todo(
        'Shows warning when unable to sign due to items not being checked or NA'
    );
    test.todo('Disables field when pressing sign on an unsigned checklist');
    test.todo('Disables check button when NA is checked for an item');
});
