import React, { ChangeEvent } from 'react';
import { Search } from '@equinor/eds-core-react';
import withAccessControl from '../../security/withAccessControl';
import styled from 'styled-components';
import { AsyncStatus } from '../../contexts/UserContext';
import useSearchPageFacade, { SearchStatus } from './useSearchPageFacade';
import SkeletonLoadingPage from '../../components/loading/SkeletonLoader';
import SearchResults from '../../components/SearchResults';
import useMatchProjectInPath from './useMatchProjectInPath';

const SearchPageWrapper = styled.main`
    padding: 4%;
    & h4 {
        text-align: center;
        margin-top: 20px;
    }
    & span {
        height: 60px;
        margin-bottom: 10px;
    }
`;

const SearchPage = () => {
    const { matchProjectStatus } = useMatchProjectInPath();
    const { hits, searchStatus, query, setQuery } = useSearchPageFacade();

    if (matchProjectStatus === AsyncStatus.LOADING) {
        return <SkeletonLoadingPage text={`Loading project . . .`} />;
    }

    const searchHeaderToRender = () => {
        if (searchStatus === SearchStatus.SUCCESS) {
            return (
                <h4>
                    Displaying {hits.items.length} out of {hits.maxAvailable}{' '}
                    packages
                </h4>
            );
        }
        if (searchStatus === SearchStatus.LOADING) {
            return <h4>Loading . . .</h4>;
        }
        return <h4>Find a Commissioning Package</h4>;
    };
    return (
        <SearchPageWrapper>
            {searchHeaderToRender()}
            <Search
                placeholder={'For example: "1002-D01"'}
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuery(e.target.value)
                }
            />
            <SearchResults
                commPackages={hits.items}
                searchStatus={searchStatus}
            />
        </SearchPageWrapper>
    );
};

export default withAccessControl(SearchPage, ['COMMPKG/READ']);
