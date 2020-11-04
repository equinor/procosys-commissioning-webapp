import React, { ChangeEvent, useContext, useState } from 'react';
import { Search, Typography } from '@equinor/eds-core-react';
import withAccessControl from '../../security/withAccessControl';
import PlantContext from '../../contexts/PlantContext';
import { AsyncStatus } from '../../contexts/UserContext';
import FullPageLoader from '../loading/FullPageLoader';
import styled from 'styled-components';
import { tokens } from '@equinor/eds-tokens';

const BREAKPOINTS = {
    mobile: '@media (max-width: 800px)',
};

const SearchPageWrapper = styled.main`
    padding: 4%;
    h4 {
        ${tokens.typography.heading.h6}
    }
    ${BREAKPOINTS.mobile} {
        background-color: red;
    }
`;

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState('');
    alert('REACHED SEARCH');
    return (
        <SearchPageWrapper>
            <Typography variant="h4">Search for a comm package: </Typography>
            <Search
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(e.target.value)
                }
            />
        </SearchPageWrapper>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
