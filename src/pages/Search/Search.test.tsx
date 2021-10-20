import { render, screen } from '@testing-library/react';
import React from 'react';
import Search from './Search';
import { withPlantContext } from '../../test/contexts';
import userEvent from '@testing-library/user-event';
import { testTagSearch, testCommPkgPreview } from '../../test/dummyData';

describe('<Search/>', () => {
    beforeEach(() => {
        render(
            withPlantContext({
                Component: <Search />,
            })
        );
    });
    it('Renders a comm package preview upon successful search containing search results', async () => {
        const searchButton = await screen.findByRole('button', {
            name: 'Comm',
        });
        expect(searchButton).toBeInTheDocument();
        userEvent.click(searchButton);
        const searchField = await screen.findByRole('search', {
            name: 'Searchbar',
        });
        expect(searchField).toBeInTheDocument();
        userEvent.type(searchField, 'test');
        expect(
            await screen.findByText(testCommPkgPreview[0].description)
        ).toBeInTheDocument();
    });
    it('Renders a tag preview upon successful search containing search results', async () => {
        const searchButton = await screen.findByRole('button', {
            name: 'Tag',
        });
        expect(searchButton).toBeInTheDocument();
        userEvent.click(searchButton);
        const searchField = await screen.findByRole('search', {
            name: 'Searchbar',
        });
        expect(searchField).toBeInTheDocument();
        userEvent.type(searchField, 'test');
        expect(
            await screen.findByText(testTagSearch.items[0].description)
        ).toBeInTheDocument();
    });
});
