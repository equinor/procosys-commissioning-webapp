import { withCommPkgContext } from '../../../test/contexts';
import Scope from './Scope';
import React from 'react';
import { render } from '@testing-library/react';
import { testScope } from '../../../test/dummyData';

describe('<Scope />', () => {
    it('Renders placeholder text when an empty scope is returned from API', () => {
        const { getByText } = render(
            withCommPkgContext({
                Component: <Scope />,
                scope: [],
            })
        );
        expect(getByText('The scope is empty')).toBeInTheDocument();
    });
    it('Renders a checklist preview button with tag description, tag number and formular type', () => {
        const { getByText } = render(
            withCommPkgContext({
                Component: <Scope />,
                scope: testScope,
            })
        );
        expect(getByText('Test tag description')).toBeInTheDocument();
        expect(getByText('Test tag number')).toBeInTheDocument();
        expect(getByText('Test formular type')).toBeInTheDocument();
    });
});
