import { render } from '@testing-library/react';
import React from 'react';
import { CompletionStatus } from '../../../services/apiTypes';
import DetailsCard from '../DetailsCard';

describe('<DetailsCard />', () => {
    it('Renders comm package description, package number and MC status', () => {
        const { getByText } = render(
            <DetailsCard
                description="CommPkgDescription"
                pkgNumber="CommPkgNumber"
                MCStatus={CompletionStatus.OK}
                commStatus={CompletionStatus.OK}
            />
        );
        expect(getByText('CommPkgDescription')).toBeInTheDocument();
        expect(getByText('CommPkgNumber')).toBeInTheDocument();
        expect(getByText('MC Status')).toBeInTheDocument();
    });
});
