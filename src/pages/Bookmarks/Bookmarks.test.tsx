import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Bookmarks from './Bookmarks';
import { withPlantContext } from '../../test/contexts';

describe('<Bookmarks/>', () => {
    it('Renders find comm pkg button', () => {
        const { getByText } = withPlantContext({ Component: <Bookmarks /> });
        expect(getByText('Find comm. pkg')).toBeInTheDocument();
    });
});
