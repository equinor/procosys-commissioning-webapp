import { StorageKey } from '@equinor/procosys-webapp-components';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../test/contexts';
import { testProjects } from '../../../test/dummyData';
import Bookmarks from './Bookmarks';

const renderBookmarks = (): void => {
    window.localStorage.clear();
    window.localStorage.setItem(
        `${StorageKey.BOOKMARK}: ${testProjects[1].id}`,
        JSON.stringify(['123'])
    );
    render(
        withPlantContext({
            Component: <Bookmarks />,
        })
    );
};

describe('<Bookmarks/>', () => {
    it('Renders bookmarks saved to localstorage', async () => {
        renderBookmarks();
        expect(
            await screen.findByText('dummy-commPkg-description')
        ).toBeInTheDocument();
    });
});
