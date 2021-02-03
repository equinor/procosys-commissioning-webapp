import { withCommPkgContext } from '../../../test/contexts';
import React from 'react';
import PunchList from './PunchList';
import { render } from '@testing-library/react';
import { testPunchList } from '../../../test/dummyData';

describe('<PunchList />', () => {
    it('Renders placeholder text when an empty punch list is returned from API', () => {
        const { getByText } = render(
            withCommPkgContext({
                Component: <PunchList />,
                punchList: [],
            })
        );
        expect(getByText('No punches to display.')).toBeInTheDocument();
    });
    it('Renders a punch preview button with description, module and tag', () => {
        const { getByText } = render(
            withCommPkgContext({
                Component: <PunchList />,
                punchList: testPunchList,
            })
        );
        expect(getByText('Test punch description')).toBeInTheDocument();
        expect(getByText('Test tag description')).toBeInTheDocument();
        expect(getByText('Test punch system module')).toBeInTheDocument();
    });
});
