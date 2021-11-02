import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { SearchStatus } from '../../useSearchPageFacade';
import { SearchResults as SearchResultsType } from '../../../../services/apiTypes';
import SkeletonLoadingPage from '../../../../components/loading/SkeletonLoader';
import { PackageStatusIcon } from '../../../../components/icons/PackageStatusIcon';
import { COLORS } from '../../../../style/GlobalStyles';
import { SearchType } from '../../Search';
import useCommonHooks from '../../../../utils/useCommonHooks';
import ResultsList from './ResultsList';

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
        return (
            <SearchResultsWrapper>
                <p>
                    <i>
                        Start typing your Commissioning Package number in the
                        field above. <br />
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
        return (
            <SearchResultsWrapper>
                <p>
                    <i>No packages found for this search.</i>
                </p>
            </SearchResultsWrapper>
        );
    }
};

export default SearchResults;
