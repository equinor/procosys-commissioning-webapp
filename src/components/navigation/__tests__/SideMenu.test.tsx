import React from 'react';
import { withPlantContext } from '../../../pages/__tests__/SelectProject.test';
import SideMenu from '../SideMenu';

jest.mock('../../services/authService');
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
    it('Renders username', () => {});
});
