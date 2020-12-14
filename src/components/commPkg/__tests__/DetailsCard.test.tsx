import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CompletionStatus } from '../../../services/apiTypes';
import DetailsCard from '../DetailsCard';

describe('<DetailsCard />', () => {
    it('Renders comm package description, package number and MC status', () => {
        const { getByText } = render(
            <Router>
                <DetailsCard
                    details={{
                        description: 'CommPkgDescription',
                        pkgNumber: 'CommPkgNumber',
                        MCStatus: CompletionStatus.OK,
                        commStatus: CompletionStatus.OK,
                    }}
                />
            </Router>
        );
        expect(getByText('CommPkgDescription')).toBeInTheDocument();
        expect(getByText('CommPkgNumber')).toBeInTheDocument();
        expect(getByText('MC Status:')).toBeInTheDocument();
    });
});
