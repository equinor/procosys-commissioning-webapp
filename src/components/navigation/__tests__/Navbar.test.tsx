import { render } from '@testing-library/react';
import React from 'react';
import { withPlantContext } from '../../../pages/__tests__/SelectProject.test';
import Navbar from '../Navbar';

jest.mock('../../EdsIcon', () => (name: string) => <div>{name}</div>);
jest.mock('../../../assets/img/procosys-logo.svg', () => ({
    logo: () => <img />,
}));
jest.mock('react-spring', () => ({
    useSpring: jest.fn().mockImplementation(() => [{ mockProp: 1 }, jest.fn()]),
    animated: {
        div: () => <div data-testid="ANIMATED-COMPONENT" />,
        aside: () => <aside data-testid="ANIMATED-COMPONENT" />,
    },
}));

describe('<SideMenu/>', () => {
    it('returns a navbar container', () => {
        const { container } = render(<Navbar />);
        expect(container).toBeDefined();
    });
    it('Renders Procosys logo', () => {
        const { getByText } = withPlantContext({
            Component: <Navbar />,
        });
        expect(getByText('procosys-logo')).toBeInTheDocument();
    });
});
