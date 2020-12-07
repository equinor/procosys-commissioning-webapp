import { render } from '@testing-library/react';
import React from 'react';
import DetailsCard from '../DetailsCard';

describe('<DetailsCard />', () => {
    it('Renders comm package description, package number and MC status', () => {
        const { getByText } = render(
            <DetailsCard
                description="CommPkgDescription"
                pkgNumber="CommPkgNumber"
                MCStatus="MCStatus"
                commStatus="CommStatus"
            />
        );
        expect(getByText('CommPkgDescription')).toBeInTheDocument();
        expect(getByText('CommPkgNumber')).toBeInTheDocument();
        expect(getByText('MCStatus')).toBeInTheDocument();
    });
});
