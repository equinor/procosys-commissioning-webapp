import { testPunchList, withCommPkgContext } from '../../../test/contexts';
import React from 'react';
import PunchList from '../PunchList';

describe('<PunchList />', () => {
    it('Renders placeholder text when an empty punch list is returned from API', () => {
        const { getByText } = withCommPkgContext({
            Component: <PunchList />,
            punchList: [],
        });
        expect(getByText('No punches to display.')).toBeInTheDocument();
    });
    it('Renders a punch preview button with description, module and tag', () => {
        const { getByText } = withCommPkgContext({
            Component: <PunchList />,
            punchList: testPunchList,
        });
        expect(getByText('Test punch description')).toBeInTheDocument();
        expect(getByText('Test tag description')).toBeInTheDocument();
        expect(getByText('Test punch system module')).toBeInTheDocument();
    });
});
