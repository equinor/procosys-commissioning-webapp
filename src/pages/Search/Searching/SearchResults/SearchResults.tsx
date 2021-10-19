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
import ResultsList from '../ResultsList';

const SearchResult = styled.article`
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid ${COLORS.lightGrey};
    & p {
        flex: auto;
        width: 200px;
    }
    & h6 {
        margin: 12px;
        white-space: nowrap;
        width: 120px;
    }
    &:hover {
        opacity: 0.7;
    }
`;

const SearchResultsWrapper = styled.div`
    width: 100%;
`;

const StatusImageWrapper = styled.div`
    display: flex;
    padding: 12px;
    & img {
        height: 20px;
        margin-left: -2px;
    }
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
