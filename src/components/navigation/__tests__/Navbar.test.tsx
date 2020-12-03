import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { withPlantContext } from '../../../pages/__tests__/SelectProject.test';
import Navbar from '../Navbar';

jest.mock('react-spring', () => ({
    useSpring: jest.fn().mockImplementation(() => [{ mockProp: 1 }, jest.fn()]),
    animated: {
        div: () => <div data-testid="ANIMATED-COMPONENT" />,
        aside: () => <aside data-testid="ANIMATED-COMPONENT" />,
    },
}));

describe('<SideMenu/>', () => {
    it('returns a navbar container', () => {
        const { container } = render(
            <Router>
                <Navbar />
            </Router>
        );
        expect(container).toBeDefined();
    });
});
