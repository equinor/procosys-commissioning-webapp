import { withPlantContext } from '../../../test/contexts';
import Scope from './Scope';
import React from 'react';
import { findByText, render, screen, waitFor } from '@testing-library/react';

const renderScope = () => {
    render(
        withPlantContext({
            Component: <Scope />,
        })
    );
};

describe('<Scope />', () => {
    it('Renders a checklist preview button with tag description', async () => {
        renderScope();
        expect(
            await screen.findByText('scope-dummy-tag-description')
        ).toBeInTheDocument();
    });
    test.todo(
        'Renders placeholder text when an empty scope is returned from API'
    );
    test.todo('Renders error screen');
});
