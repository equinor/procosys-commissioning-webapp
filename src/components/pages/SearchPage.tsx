import React, { ChangeEvent, useState } from 'react';
import { Search } from '@equinor/eds-core-react';
import withAccessControl from '../../security/withAccessControl';
import styled from 'styled-components';
import useMatchProjectInPath from '../../utils/useMatchProjectInPath';
import { AsyncStatus } from '../../contexts/UserContext';
import SkeletonLoadingPage from '../loading/SkeletonLoadingPage';

const SearchPageWrapper = styled.main`
    padding: 4%;
    & h3 {
        text-align: center;
    }
`;

const SearchPage = () => {
    const [searchInput, setSearchInput] = useState('');
    const { matchProjectStatus, currentProject } = useMatchProjectInPath();

    if (matchProjectStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text={`Loading project . . .`} />;
    }

    return (
        <SearchPageWrapper>
            <h3>Search for a comm package: </h3>
            <Search
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInput(e.target.value)
                }
            />
        </SearchPageWrapper>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
