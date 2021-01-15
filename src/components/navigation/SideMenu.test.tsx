import React from 'react';
import { withPlantContext } from '../../test/contexts';
import SideMenu from './SideMenu';

jest.mock('../../../services/authService', () => ({
    getUserName: () => 'erly',
}));

describe('<SideMenu/>', () => {
    it('Renders welcome text', () => {
        const { getByText } = withPlantContext({
            Component: (
                <SideMenu
                    animation={{}}
                    backdropAnimation={{}}
                    setDrawerIsOpen={() => {}}
                />
            ),
        });
        expect(getByText('Welcome')).toBeInTheDocument();
    });
    it('Renders username', () => {
        const { getByText } = withPlantContext({
            Component: (
                <SideMenu
                    animation={{}}
                    backdropAnimation={{}}
                    setDrawerIsOpen={() => {}}
                />
            ),
        });
        expect(getByText('erly')).toBeInTheDocument();
    });
});
