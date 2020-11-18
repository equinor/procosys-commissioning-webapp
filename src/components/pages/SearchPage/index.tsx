import React, { ChangeEvent } from 'react';
import { Search } from '@equinor/eds-core-react';
import withAccessControl from '../../../security/withAccessControl';
import styled from 'styled-components';
import { AsyncStatus } from '../../../contexts/UserContext';
import SkeletonLoadingPage from '../../loading/SkeletonLoadingPage';
import useSearchPageFacade from './useSearchPageFacade';

const SearchPageWrapper = styled.main`
    padding: 4%;
    & h3 {
        text-align: center;
    }
`;

const SearchPage = () => {
    const {
        matchProjectStatus,
        hits,
        searchStatus,
        query,
        setQuery,
    } = useSearchPageFacade();
    const commPackagesToDisplay = hits.items.map((commPackage) => (
        <h3 key={commPackage.id}>{commPackage.description}</h3>
    ));
    if (matchProjectStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text={`Loading project . . .`} />;
    }

    return (
        <SearchPageWrapper>
            <h3>Search for a comm package: </h3>
            <Search
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuery(e.target.value)
                }
            />
            {commPackagesToDisplay}
        </SearchPageWrapper>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
