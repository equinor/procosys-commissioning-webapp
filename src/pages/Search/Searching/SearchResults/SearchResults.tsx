import React from 'react';
import styled from 'styled-components';
import { SearchStatus } from '../../useSearchPageFacade';
import { SearchResults as SearchResultsType } from '../../../../typings/apiTypes';
import SkeletonLoadingPage from '../../../../components/loading/SkeletonLoader';
import ResultsList from './ResultsList';
import { SearchType } from '../../Search';

const SearchResultsWrapper = styled.div`
    width: 100%;
`;

type SearchResultsProps = {
    searchStatus: SearchStatus;
    searchResults: SearchResultsType;
    searchType: string;
};

const SearchResults = ({
    searchStatus,
    searchResults,
    searchType,
}: SearchResultsProps): JSX.Element => {
    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage fullWidth />;
    } else if (
        searchStatus === SearchStatus.SUCCESS &&
        searchResults.items.length > 0
    ) {
        return (
            <SearchResultsWrapper>
                <ResultsList
                    searchType={searchType}
                    searchResults={searchResults}
                />
            </SearchResultsWrapper>
        );
    } else if (searchStatus === SearchStatus.INACTIVE) {
        const typeText =
            searchType === SearchType.Comm ? 'Commissioning Package' : 'Tag';
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        Start typing your {typeText} number in the field above.
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    } else if (searchStatus === SearchStatus.ERROR) {
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        An error occurred, please refresh this page and try
                        again.
                    </i>
                </p>
            </SearchResultsWrapper>
        );
    } else {
        const typeText = searchType === SearchType.Comm ? 'packages' : 'tags';
        return (
            <SearchResultsWrapper>
                <p>
                    <i>No {typeText} found for this search.</i>
                </p>
            </SearchResultsWrapper>
        );
    }
};

export default SearchResults;
