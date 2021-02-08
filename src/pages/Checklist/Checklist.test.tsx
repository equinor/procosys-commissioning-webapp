import {
    render,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { withCommPkgContext } from '../../test/contexts';
import Checklist from './Checklist';

jest.useFakeTimers();

beforeEach(async () => {
    render(withCommPkgContext({ Component: <Checklist /> }));
    await waitFor(() => {
        expect(screen.getByText('Loading checklist')).toBeInTheDocument();
    });
});

describe('<Checklist/>', () => {
    it('First renders loading screen, then renders checklist details card upon successful loading', async () => {
        await expect(
            await screen.findByText('dummy-tag-description')
        ).toBeInTheDocument();
    });
    it('Renders check item header', async () => {
        expect(
            await screen.findByText('dummy-check-item-header-text')
        ).toBeInTheDocument();
    });
    test.todo('Lets user toggle the check item description');
    test.todo('Disables check button when NA is checked for an item');
});
