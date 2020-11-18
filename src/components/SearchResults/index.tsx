import React from 'react';
import styled from 'styled-components';
import { SearchStatus } from '../../pages/SearchPage/useSearchPageFacade';
import { CommPackageFromSearch } from '../../services/api';
import SkeletonLoadingPage from '../loading/SkeletonLoadingPage';
import LeftGreen from '../../assets/img/status/left_green.png';
import RightGreen from '../../assets/img/status/right_green.png';

const SearchResult = styled.article`
    width: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid #e5e5e5;
    & p {
        flex: auto;
        width: 200px;
    }
    & h6 {
        margin: 12px;
        white-space: nowrap;
        width: 120px;
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
    commPackages: CommPackageFromSearch[];
};

const SearchResults = ({ searchStatus, commPackages }: SearchResultsProps) => {
    if (searchStatus === SearchStatus.LOADING) {
        return <SkeletonLoadingPage text="Searching . . ." />;
    }
    if (searchStatus === SearchStatus.SUCCESS && commPackages.length > 0) {
        return (
            <SearchResultsWrapper>
                {commPackages.map((commPackage) => {
                    return (
                        <SearchResult key={commPackage.id}>
                            <StatusImageWrapper>
                                <img
                                    src={LeftGreen}
                                    alt={
                                        'Comm package status indicator, left side'
                                    }
                                />
                                <img
                                    src={RightGreen}
                                    alt={
                                        'Comm package status indicator, right side'
                                    }
                                />
                            </StatusImageWrapper>

                            <h6>{commPackage.commPkgNo}</h6>
                            <p>{commPackage.description}</p>
                        </SearchResult>
                    );
                })}
            </SearchResultsWrapper>
        );
    }
    if (searchStatus === SearchStatus.INACTIVE) {
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
    }
    return (
        <SearchResultsWrapper>
            <h4>No packages found for this search</h4>
        </SearchResultsWrapper>
    );
};

export default SearchResults;
